using backend.Data;
using backend.Models;
using backend.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReturnService
{
	private readonly EMSContext _context;
	private readonly BillingService _billingService;

	public ReturnService(EMSContext context, BillingService billingService)
	{
		_context = context;
		_billingService = billingService;
	}

	public async Task<Return> CreateReturnAsync(CreateReturnModel model)
	{
		if (model.Items == null || model.Items.Count == 0)
			throw new ArgumentException("At least one item must be provided for a return.");

		var receipt = await _context.Receipts
				.Include(r => r.Items)
				.FirstOrDefaultAsync(r => r.Id == model.ReceiptId);

		if (receipt == null)
			throw new ArgumentException("Receipt not found.");

		var returnedQuantities = await _context.ReturnDetails
				.Include(rd => rd.Return)
				.Where(rd => rd.Return != null && rd.Return.ReceiptId == receipt.Id)
				.GroupBy(rd => rd.BookId)
				.Select(g => new { g.Key, Quantity = g.Sum(rd => rd.Quantity) })
				.ToDictionaryAsync(g => g.Key, g => g.Quantity);

		var returnRecord = new Return
		{
			ReceiptId = receipt.Id,
			ReturnDate = DateTime.UtcNow,
		};

		decimal totalRefund = 0;

		foreach (var item in model.Items)
		{
			if (item.Quantity <= 0)
				throw new ArgumentException("Return quantity must be greater than zero.");

			var receiptItem = receipt.Items.FirstOrDefault(i => i.BookId == item.BookId);
			if (receiptItem == null)
				throw new ArgumentException("Item was not found on the receipt.");

			var alreadyReturned = returnedQuantities.TryGetValue(item.BookId, out var returnedQty)
					? returnedQty
					: 0;
			var returnableQuantity = receiptItem.Quantity - alreadyReturned;

			if (item.Quantity > returnableQuantity)
				throw new ArgumentException("Return quantity cannot exceed remaining returnable quantity.");

			var refund = receiptItem.UnitPrice * item.Quantity;
			totalRefund += refund;

			returnRecord.Items.Add(new ReturnDetail
			{
				BookId = item.BookId,
				Quantity = item.Quantity,
				Refund = refund
			});

			var storage = await _context.Storages.FirstOrDefaultAsync(s => s.Id == item.BookId);
			if (storage != null)
			{
				storage.Quantity += item.Quantity;
			}
		}

		returnRecord.TotalRefund = totalRefund;

		var previousPoints = receipt.PointsEarned;
		receipt.Total = Math.Max(0, receipt.Total - totalRefund);
		receipt.PointsEarned = _billingService.CalculatePoints(receipt.Total);

		if (!string.IsNullOrEmpty(receipt.CustomerPhone))
		{
			var customer = await _context.Customers
					.FirstOrDefaultAsync(c => c.PhoneNumber == receipt.CustomerPhone);

			if (customer != null)
			{
				customer.Points = Math.Max(0, customer.Points + (receipt.PointsEarned - previousPoints));
			}
		}

		_context.Returns.Add(returnRecord);
		await _context.SaveChangesAsync();

		return returnRecord;
	}

	public async Task DeleteReturnAsync(Guid returnId)
	{
		var returnRecord = await _context.Returns
				.Include(r => r.Items)
				.Include(r => r.Receipt)
				.FirstOrDefaultAsync(r => r.Id == returnId);

		if (returnRecord == null)
			throw new ArgumentException("Return not found.");

		if (returnRecord.Receipt == null)
			throw new ArgumentException("Associated receipt not found.");

		foreach (var item in returnRecord.Items)
		{
			var storage = await _context.Storages.FirstOrDefaultAsync(s => s.Id == item.BookId);
			if (storage == null)
				throw new ArgumentException("Storage not found.");

			if (storage.Quantity < item.Quantity)
				throw new ArgumentException("Not enough stock to undo this return.");

			storage.Quantity -= item.Quantity;
		}

		var receipt = returnRecord.Receipt;
		var previousPoints = receipt.PointsEarned;
		receipt.Total += returnRecord.TotalRefund;
		receipt.PointsEarned = _billingService.CalculatePoints(receipt.Total);

		if (!string.IsNullOrEmpty(receipt.CustomerPhone))
		{
			var customer = await _context.Customers
					.FirstOrDefaultAsync(c => c.PhoneNumber == receipt.CustomerPhone);

			if (customer != null)
			{
				customer.Points = Math.Max(0, customer.Points + (receipt.PointsEarned - previousPoints));
			}
		}

		_context.Returns.Remove(returnRecord);
		await _context.SaveChangesAsync();
	}
}