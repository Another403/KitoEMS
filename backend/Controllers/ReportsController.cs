using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
	private readonly BillingService _billingService;

	public ReportsController(BillingService billingService)
	{
		_billingService = billingService;
	}

	[HttpGet("sales")]
	public async Task<IActionResult> GetSalesReport([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int limit = 10)
	{
		try
		{
			var report = await _billingService.GetSalesReportAsync(from, to, limit);
			return Ok(report);
		}
		catch (ArgumentException ex)
		{
			return BadRequest(new { message = ex.Message });
		}
	}

	[HttpGet("best-sellers")]
	public async Task<IActionResult> GetBestSellers([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int limit = 10)
	{
		try
		{
			var bestSellers = await _billingService.GetBestSellersAsync(from, to, limit);
			return Ok(bestSellers);
		}
		catch (ArgumentException ex)
		{
			return BadRequest(new { message = ex.Message });
		}
	}

	[HttpGet("top-employees")]
	public async Task<IActionResult> GetTopEmployees([FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int limit = 10)
	{
		try
		{
			var employees = await _billingService.GetTopEmployeesAsync(from, to, limit);
			return Ok(employees);
		}
		catch (ArgumentException ex)
		{
			return BadRequest(new { message = ex.Message });
		}
	}
}