using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Drawing;
using System.Runtime.InteropServices;
using backend.Models.Dto;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Services;

public class BillingService
{
	private readonly EMSContext _context;
	private readonly decimal _commissionRate = 0.04m;
	private readonly int _pointsPerAmount = 100;

	public BillingService(EMSContext context)
	{
		_context = context;
	}

	public int CalculatePoints(decimal TotalAmount)
	{
		if (TotalAmount <= 0) return 0;
		return (int)(Math.Floor(TotalAmount / _pointsPerAmount));
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
		var query = _context.Receipts
			.Include(r => r.Items).ThenInclude(i => i.Book)
			.AsQueryable();

		if (from.HasValue)
			query = query.Where(r => r.CreatedAt >= from.Value);
		if (to.HasValue)
			query = query.Where(r => r.CreatedAt <= to.Value);

		var receipts = await query.ToListAsync();

		decimal totalAmount = receipts.Sum(b => b.Total);
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

	public async Task<object> GetSalesReportAsync(DateTime? from, DateTime? to)
	{
		var query = _context.Receipts
			.Include(r => r.Items).ThenInclude(i => i.Book)
			.AsQueryable();

		if (from.HasValue)
			query = query.Where(r => r.CreatedAt >= from.Value);
		if (to.HasValue)
			query = query.Where(r => r.CreatedAt <= to.Value);

		var receipts = await query.ToListAsync();

		var totalRevenue = receipts.Sum(b => b.Total);
		var totalreceipts = receipts.Count;
		var bestSelling = receipts
			.SelectMany(b => b.Items)
			.GroupBy(i => new { i.BookId, i.Book!.Name })
			.Select(g => new { BookId = g.Key.BookId, Title = g.Key.Name, Quantity = g.Sum(i => i.Quantity) })
			.OrderByDescending(x => x.Quantity)
			.Take(10)
			.ToList();

		return new
		{
			TotalRevenue = totalRevenue,
			Totalreceipts = totalreceipts,
			BestSelling = bestSelling
		};
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
		storage.Quantity -= newItem.Quantity;

		await _context.SaveChangesAsync();
		return receipt;
	}
}
