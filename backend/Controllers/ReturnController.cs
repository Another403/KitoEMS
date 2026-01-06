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
	public async Task<ActionResult<List<ReceiptItem>>> GetReceiptItems(Guid id)
	{
		var items = await _context.ReceiptItems
				.Include(i => i.Book)
				.Where(i => i.ReceiptId == id)
				.ToListAsync();

		if (items.Count == 0)
			return NotFound(new { message = "No items found for this receipt." });

		return Ok(items);
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
}