using backend.Data;
using backend.Models;
using backend.Models.Dto;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class ReceiptsController : ControllerBase
{
	public readonly BillingService _service;
	public readonly EMSContext _context;

	public ReceiptsController(BillingService service, EMSContext context)
	{
		_service = service;
		_context = context;
	}

	[HttpGet]
	public async Task<ActionResult<List<Receipt>>> GetAllReceipts()
	{
		return Ok(await _context.Receipts
			.Include(r => r.Items).ThenInclude(i => i.Book)
			.Include(r => r.Employee)
			.Include(r => r.Customer)
			.ToListAsync());
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Receipt>> GetReceiptById(Guid id)
	{
		var receipt = await _context.Receipts
			.Include(r => r.Items).ThenInclude(i => i.Book)
			.Include(r => r.Employee)
			.Include(r => r.Customer)
			.FirstOrDefaultAsync(r => r.Id == id);

		if (receipt == null)
		{
			return NotFound(new { message = "receipt not found" });
		}

		return Ok(receipt);
	}

	[HttpGet("report")]
	public async Task<IActionResult> GetSalesReport([FromQuery] DateTime? from, [FromQuery] DateTime? to)
	{
		var report = await _service.GetSalesReportAsync(from, to);

		return Ok(report);
	}

	[HttpGet("report/employee/{id}")]
	public async Task<IActionResult> GetEmployeeSalesReport(string id, DateTime? from, [FromQuery] DateTime? to)
	{
		var user = await _context.AppUsers.FindAsync(id);

		if (user == null)
		{
			return NotFound(new { message = "user not found!" });
		}

		var report = await _service.GetEmployeeSalesReportAsync(id, from, to);

		return Ok(report);
	}

	[HttpGet("items")]
	public async Task<ActionResult<List<ReceiptItem>>> GetAllItems()
	{
		return Ok(await _context.ReceiptItems.ToListAsync());
	}

	[HttpPost]
	public async Task<IActionResult> CreateReceipt([FromBody] CreateReceiptModel createReceiptModel)
	{
		var receipt = await _service.CreateReceiptAsync(createReceiptModel);

		var detailedReceipt = await _context.Receipts
			.Where(r => r.Id == receipt.Id)
			.Include(r => r.Items).ThenInclude(i => i.Book)
			.Include(r => r.Customer)
			.FirstOrDefaultAsync();

		return Ok(detailedReceipt);
	}

	[HttpPost("{id}/items")]
	public async Task<IActionResult> AddItemToReceipt(Guid id,	[FromBody] ReceiptItem newItem)
	{
		try
		{
			var receipt = await _service.AddItemToReceiptAsync(id, newItem);

			var detailedReceipt = await _context.Receipts
				.Include(r => r.Items).ThenInclude(i => i.Book)
				.Include(r => r.Customer)
				.Include(r => r.Employee)
				.FirstAsync(r => r.Id == receipt.Id);

			return Ok(detailedReceipt);
		}
		catch (Exception ex)
		{
			return BadRequest(new { message = ex.Message });
		}
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteReceipt(Guid id)
	{
		var receipt = await _context.Receipts.FindAsync(id);

		if (receipt == null)
		{
			return NotFound(new { message = "receipt not found!" });
		}

		_context.Receipts.Remove(receipt);
		await _context.SaveChangesAsync();

		return Ok(receipt);
	}
}
