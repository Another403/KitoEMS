using backend.Data;
using backend.Models;
using backend.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class BillingService
{
	private readonly EMSContext _context;
	private readonly decimal _commissionRate = 0.04m;
	private readonly int _pointsPerAmount = 10;

	public BillingService(EMSContext context)
	{
		_context = context;
	}

	public int CalculatePoints(decimal TotalAmount)
	{
		if (TotalAmount <= 0) return 0;
		return (int)(Math.Floor(TotalAmount / _pointsPerAmount));
	}

	private (DateTime? From, DateTime? To) ResolveDateRange(string? range, DateTime? from, DateTime? to)
	{
		if (string.IsNullOrWhiteSpace(range))
			return (from, to);

		var normalizedRange = range!.Trim().ToLowerInvariant();
		var now = DateTime.UtcNow;

		return normalizedRange switch
		{
			"weekly" => (now.Date.AddDays(-(int)now.DayOfWeek), now),
			"monthly" => (new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc), now),
			"yearly" => (new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc), now),
			"custom" when from.HasValue && to.HasValue => (from, to),
			"custom" => throw new ArgumentException("Custom range requires both 'from' and 'to' values."),
			_ => throw new ArgumentException("Invalid range. Valid values are: weekly, monthly, yearly, custom."),
		};
	}

	private IQueryable<Receipt> BuildReceiptQuery(DateTime? from, DateTime? to)
	{
		var query = _context.Receipts
				.Include(r => r.Items).ThenInclude(i => i.Book)
				.Include(r => r.Employee)
				.AsQueryable();

		if (from.HasValue)
			query = query.Where(r => r.CreatedAt >= from.Value);
		if (to.HasValue)
			query = query.Where(r => r.CreatedAt <= to.Value);

		return query;
	}
	private IQueryable<Return> BuildReturnQuery(DateTime? from, DateTime? to)
	{
		var query = _context.Returns
			.Include(r => r.Receipt)
			.ThenInclude(r => r.Employee)
			.AsQueryable();

		if (from.HasValue)
			query = query.Where(r => r.ReturnDate >= from.Value);
		if (to.HasValue)
			query = query.Where(r => r.ReturnDate <= to.Value);

		return query;
	}

	public void CalculateReceipt(Receipt receipt)
	{
		receipt.Total = receipt.Items.Sum(i => i.Quantity * i.UnitPrice);
		receipt.PointsEarned = CalculatePoints(receipt.Total);
	}

	public async Task<Receipt> CreateReceiptAsync(CreateReceiptModel createReceiptModel)
	{
		var bookIds = createReceiptModel.Items.Select(i => i.BookId).ToList();

		var books = await _context.Books
			.Where(b => bookIds.Contains(b.Id))
			.ToDictionaryAsync(b => b.Id);

		var storages = await _context.Storages
			.Where(s => bookIds.Contains(s.Id))
			.ToDictionaryAsync(s => s.Id);

		var total = createReceiptModel.Items.Sum(i => i.Quantity * (i.UnitPrice != 0 ? i.UnitPrice : books[i.BookId].Price));
		var points = CalculatePoints(total);

		var receipt = new Receipt
		{
			CustomerPhone = createReceiptModel.CustomerPhone,
			EmployeeId = createReceiptModel.EmployeeId,
			Total = total,
			PointsEarned = points
		};

		foreach (var item in createReceiptModel.Items)
		{
			receipt.Items.Add(new ReceiptItem
			{
				BookId = item.BookId,
				Quantity = item.Quantity,
				UnitPrice = item.UnitPrice != 0 ? item.UnitPrice : books[item.BookId].Price
			});

			var storage = storages[item.BookId];

			if (storage != null)
			{
				storage.Quantity = Math.Max(0, storage.Quantity - item.Quantity);
			}
		}

		_context.Receipts.Add(receipt);

		if (createReceiptModel.CustomerPhone != null)
		{
			var customer = await _context.Customers
				.FirstOrDefaultAsync(c => c.PhoneNumber == createReceiptModel.CustomerPhone);

			if (customer != null)
			{
				customer.Points += points;
			}
		}

		await _context.SaveChangesAsync();
		return receipt;
	}

	public async Task<object> GetEmployeeSalesReportAsync(string EmployeeId, DateTime? from, DateTime? to)
	{
		var receipts = await BuildReceiptQuery(from, to)
			.Where(r => r.EmployeeId == EmployeeId)
			.ToListAsync();
		var returns = await BuildReturnQuery(from, to)
			.Where(r => r.Receipt != null && r.Receipt.EmployeeId == EmployeeId)
			.ToListAsync();

		decimal totalAmount = receipts.Sum(b => b.Total) - returns.Sum(r => r.TotalRefund);
		decimal bonus = totalAmount * _commissionRate;
		int booksSold = receipts
			.SelectMany(r => r.Items)
			.Sum(i => i.Quantity);

		return new
		{
			Bonus = bonus,
			TotalAmount = totalAmount,
			BooksSold = booksSold,
			ReceiptCount = receipts.Count
		};
	}

	public async Task<SalesReportResult> GetSalesReportAsync(DateTime? from, DateTime? to, int limit = 10)
	{
		var receipts = await BuildReceiptQuery(from, to).ToListAsync();

		var totalRevenue = receipts.Sum(b => b.Total);
		var totalReceipts = receipts.Count;
		var bestSelling = receipts
			.SelectMany(b => b.Items)
			.GroupBy(i => new { i.BookId, i.Book!.Name })
			.Select(g => new BestSellerReportItem { BookId = g.Key.BookId, Title = g.Key.Name, Quantity = g.Sum(i => i.Quantity) })
			.OrderByDescending(x => x.Quantity)
			.Take(limit)
			.ToList();

		return new SalesReportResult
		{
			TotalRevenue = totalRevenue,
			TotalReceipts = totalReceipts,
			BestSelling = bestSelling
		};
	}

	public async Task<List<BestSellerReportItem>> GetBestSellersAsync(DateTime? from, DateTime? to, int limit = 10)
	{
		var receipts = await BuildReceiptQuery(from, to).ToListAsync();

		return receipts
			.SelectMany(b => b.Items)
			.GroupBy(i => new { i.BookId, i.Book!.Name })
			.Select(g => new BestSellerReportItem
			{
				BookId = g.Key.BookId,
				Title = g.Key.Name,
				Quantity = g.Sum(i => i.Quantity)
			})
			.OrderByDescending(x => x.Quantity)
			.Take(limit)
			.ToList();
	}

	public async Task<List<EmployeeRevenueReportItem>> GetTopEmployeesAsync(DateTime? from, DateTime? to, int limit = 10)
	{
		var receipts = await BuildReceiptQuery(from, to).ToListAsync();
		var returns = await BuildReturnQuery(from, to).ToListAsync();
		var returnTotals = returns
			.Where(r => r.Receipt != null)
			.GroupBy(r => r.Receipt!.EmployeeId)
			.ToDictionary(g => g.Key, g => g.Sum(r => r.TotalRefund));

		return receipts
			.GroupBy(r => new
			{
				r.EmployeeId,
				Name = r.Employee != null && !string.IsNullOrWhiteSpace(r.Employee.FullName)
							? r.Employee.FullName
							: "Unknown"
			})
			.Select(g => new EmployeeRevenueReportItem
			{
				EmployeeId = g.Key.EmployeeId,
				FullName = g.Key.Name,
				Revenue = g.Sum(r => r.Total) - (returnTotals.TryGetValue(g.Key.EmployeeId, out var refunds) ? refunds : 0m),
				ReceiptCount = g.Count()
			})
			.OrderByDescending(e => e.Revenue)
			.ThenBy(e => e.FullName)
			.Take(limit)
			.ToList();
	}

	public async Task<Receipt> AddItemToReceiptAsync(Guid id, ReceiptItem newItem)
	{
		var receipt = await _context.Receipts
			.Include(r => r.Items)
			.FirstOrDefaultAsync(r => r.Id == id);

		if (receipt == null)
			throw new Exception("Receipt not found");

		var book = await _context.Books.FindAsync(newItem.BookId);
		if (book == null)
			throw new Exception("Book not found");

		var storage = await _context.Storages
			.FirstOrDefaultAsync(s => s.Id == newItem.BookId);

		if (storage == null || storage.Quantity < newItem.Quantity)
			throw new Exception("Not enough stock");

		var unitPrice = (newItem.UnitPrice > 0)
			? newItem.UnitPrice
			: book.Price;

		var existingItem = receipt.Items
			.FirstOrDefault(i => i.BookId == newItem.BookId);

		if (existingItem != null)
		{
			existingItem.Quantity += newItem.Quantity;

			if (newItem.UnitPrice > 0)
				existingItem.UnitPrice = unitPrice;
		}
		else
		{
			var item = new ReceiptItem
			{
				ReceiptId = id,
				BookId = newItem.BookId,
				Quantity = newItem.Quantity,
				UnitPrice = unitPrice
			};

			receipt.Items.Add(item);
		}
		receipt.Total += unitPrice * newItem.Quantity;

		var prevPoint = receipt.PointsEarned;

		receipt.PointsEarned = CalculatePoints(receipt.Total);
		storage.Quantity -= newItem.Quantity;

		var customer = await _context.Customers
			.FirstOrDefaultAsync(customer => customer.PhoneNumber == receipt.CustomerPhone);

		if (customer != null)
		{
			customer.Points = Math.Max(0, customer.Points + (receipt.PointsEarned - prevPoint));
		}

		await _context.SaveChangesAsync();
		return receipt;
	}

	public async Task<ReceiptItem> UpdateReceiptItemAsync(Guid id, ReceiptItem updateItem)
	{
		var item = await _context.ReceiptItems
			.FindAsync(id);
		if (item == null)
			throw new Exception("Receipt item not found");

		var receipt = await _context.Receipts
			.Include(r => r.Items)
			.FirstOrDefaultAsync(r => r.Id == item.ReceiptId);
		if (receipt == null)
			throw new Exception("Receipt not found");

		var storage = await _context.Storages
			.FindAsync(item.BookId);
		if (storage == null)
			throw new Exception("No storage data found for this item");

		if (storage.Quantity < (item.Quantity - updateItem.Quantity))
			throw new Exception("Not enough stock");

		item.Quantity = updateItem.Quantity;
		item.UnitPrice = updateItem.UnitPrice;
		storage.Quantity -= (item.Quantity - updateItem.Quantity);

		var prevPoint = receipt.PointsEarned;
		CalculateReceipt(receipt);
		var customer = await _context.Customers
			.FirstOrDefaultAsync(customer => customer.PhoneNumber == receipt.CustomerPhone);

		if (customer != null)
		{
			customer.Points = Math.Max(0, customer.Points + (receipt.PointsEarned - prevPoint));
		}

		await _context.SaveChangesAsync();
		return item;
	}

	public async Task DeleteReceiptItemAsync(Guid id)
	{
		var item = await _context.ReceiptItems
			.FirstOrDefaultAsync(i => i.Id == id);

		if (item == null)
			throw new Exception("Receipt item not found");

		var receipt = await _context.Receipts
			.Include(r => r.Items)
			.FirstOrDefaultAsync(r => r.Id == item.ReceiptId);

		if (receipt == null)
			throw new Exception("Receipt not found");

		var storage = await _context.Storages
			.FirstOrDefaultAsync(s => s.Id == item.BookId);

		if (storage == null)
			throw new Exception("Storage not found");

		storage.Quantity += item.Quantity;

		var prevPoints = receipt.PointsEarned;

		receipt.Items.Remove(item);
		_context.ReceiptItems.Remove(item);
		CalculateReceipt(receipt);

		if (!string.IsNullOrEmpty(receipt.CustomerPhone))
		{
			var customer = await _context.Customers
				.FirstOrDefaultAsync(c => c.PhoneNumber == receipt.CustomerPhone);

			if (customer != null)
			{
				customer.Points = Math.Max(0, customer.Points + (receipt.PointsEarned - prevPoints));
			}
		}

		await _context.SaveChangesAsync();
	}

	public async Task DeleteReceiptAsync(Guid id)
	{
		var receipt = await _context.Receipts
			.Include(r => r.Items)
			.FirstOrDefaultAsync(r => r.Id == id);

		if (receipt == null)
			throw new Exception("Receipt not found");

		foreach (var item in receipt.Items)
		{
			var storage = await _context.Storages
				.FirstOrDefaultAsync(s => s.Id == item.BookId);

			if (storage != null)
			{
				storage.Quantity += item.Quantity;
			}
		}

		if (!string.IsNullOrEmpty(receipt.CustomerPhone))
		{
			var customer = await _context.Customers
				.FirstOrDefaultAsync(c => c.PhoneNumber == receipt.CustomerPhone);

			if (customer != null)
			{
				customer.Points = Math.Max(0, customer.Points - receipt.PointsEarned);
			}
		}

		_context.Receipts.Remove(receipt);
		await _context.SaveChangesAsync();
	}
}