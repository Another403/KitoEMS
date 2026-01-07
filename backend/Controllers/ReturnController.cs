using backend.Data;
using backend.Models;
using backend.Models.Dto;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReturnsController : ControllerBase
{
	private readonly EMSContext _context;
	private readonly ReturnService _service;

	public ReturnsController(EMSContext context, ReturnService service)
	{
		_context = context;
		_service = service;
	}

	[HttpGet]
	public async Task<ActionResult<List<Return>>> GetReturns()
	{
		var returns = await _context.Returns
				.Include(r => r.Items)
				.ThenInclude(i => i.Book)
				.Include(r => r.Receipt)
				.ThenInclude(rc => rc!.Customer)
				.OrderByDescending(r => r.ReturnDate)
				.ToListAsync();

		return Ok(returns);
	}

	[HttpGet("receipts")]
	public async Task<ActionResult<List<Receipt>>> GetReceipts()
	{
		var receipts = await _context.Receipts
				.Include(r => r.Items)
				.ThenInclude(i => i.Book)
				.Include(r => r.Customer)
				.ToListAsync();

		return Ok(receipts);
	}

	[HttpGet("receipts/{id}/items")]
	public async Task<ActionResult<List<ReceiptReturnItemModel>>> GetReceiptItems(Guid id)
	{
		var items = await _context.ReceiptItems
				.Include(i => i.Book)
				.Where(i => i.ReceiptId == id)
				.ToListAsync();

		if (items.Count == 0)
			return NotFound(new { message = "No items found for this receipt." });

		var returnedQuantities = await _context.ReturnDetails
				.Include(rd => rd.Return)
				.Where(rd => rd.Return != null && rd.Return.ReceiptId == id)
				.GroupBy(rd => rd.BookId)
				.Select(g => new { g.Key, Quantity = g.Sum(rd => rd.Quantity) })
				.ToDictionaryAsync(g => g.Key, g => g.Quantity);

		var result = items.Select(item =>
		{
			var returnedQuantity = returnedQuantities.TryGetValue(item.BookId, out var returnedQty)
					? returnedQty
					: 0;
			var returnableQuantity = Math.Max(0, item.Quantity - returnedQuantity);

			return new ReceiptReturnItemModel
			{
				Id = item.Id,
				BookId = item.BookId,
				Book = item.Book,
				Quantity = item.Quantity,
				UnitPrice = item.UnitPrice,
				ReturnedQuantity = returnedQuantity,
				ReturnableQuantity = returnableQuantity
			};
		}).ToList();

		return Ok(result);
	}

	[HttpPost]
	public async Task<IActionResult> CreateReturn([FromBody] CreateReturnModel model)
	{
		try
		{
			var created = await _service.CreateReturnAsync(model);
			var detailed = await _context.Returns
					.Include(r => r.Items)
					.ThenInclude(i => i.Book)
					.Include(r => r.Receipt)
					.ThenInclude(rc => rc!.Customer)
					.FirstOrDefaultAsync(r => r.Id == created.Id);

			return Ok(detailed);
		}
		catch (Exception ex)
		{
			return BadRequest(new { message = ex.Message });
		}
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteReturn(Guid id)
	{
		try
		{
			await _service.DeleteReturnAsync(id);
			return Ok(new { message = "Return deleted successfully." });
		}
		catch (Exception ex)
		{
			return BadRequest(new { message = ex.Message });
		}
	}
}