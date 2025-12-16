using backend.Data;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class PayrollsController : ControllerBase
{
	private readonly EMSContext _context;
	private readonly UserManager<AppUser> _userManager;
	private readonly IConfiguration _configuration;
	public PayrollsController(EMSContext context, UserManager<AppUser> userManager, IConfiguration configuration)
	{
		_context = context;
		_userManager = userManager;
		_configuration = configuration;
	}

	[HttpGet]
	public async Task<ActionResult<List<Payroll>>> GetAllPayrolls()
	{
		return Ok(await _context.Payrolls
			.Include(p => p.User)
			.ToListAsync());
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Payroll>> GetPayrollById(Guid id)
	{
		var payroll = await _context.Payrolls
			.Include(p => p.User)
			.FirstOrDefaultAsync(p => p.Id == id);

		if (payroll == null)
			return NotFound();

		return Ok(payroll);
	}

	[HttpPost]
	public async Task<IActionResult> AddPayroll([FromBody] AddPayrollModel rawPayroll)
	{
		if (rawPayroll == null)
		{
			return BadRequest();
		}

		var _user = await _userManager.FindByIdAsync(rawPayroll.UserId);

		if (_user == null)
		{
			return NotFound(new { message = "User not found!" });
		}

		var newPayroll = new Payroll
		{
			Month = rawPayroll.Month,
			Year = rawPayroll.Year,
			Bonus = rawPayroll.Bonus,
			UserId = rawPayroll.UserId,
			User = _user
		};

		if (rawPayroll.BaseSalary != 0 && rawPayroll.BaseSalary != _user.Salary)
		{
			newPayroll.BaseSalary = rawPayroll.BaseSalary;
		}
		else
		{
			newPayroll.BaseSalary = _user.Salary;
		}

		_context.Payrolls.Add(newPayroll);
		await _context.SaveChangesAsync();

		return Ok(newPayroll);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> UpdatePayroll(Guid id, [FromBody] Payroll updatePayroll)
	{
		var payroll = await _context.Payrolls
			.Include(p => p.User)
			.FirstOrDefaultAsync(p => p.Id == id);

		if (payroll == null)
			return NotFound(new { message = "Payroll not found!" });

		payroll.Month = updatePayroll.Month;
		payroll.Year = updatePayroll.Year;
		payroll.Bonus = updatePayroll.Bonus;

		if (updatePayroll.BaseSalary != 0 && updatePayroll.BaseSalary != payroll.User.Salary)
			payroll.BaseSalary = updatePayroll.BaseSalary;
		else
			payroll.BaseSalary = payroll.User.Salary;

		await _context.SaveChangesAsync();

		return Ok(payroll);
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeletePayroll(Guid id)
	{
		var payroll = await _context.Payrolls.FindAsync(id);

		if (payroll == null)
		{
			return NotFound(new { message = "Payroll not found!" });
		}

		_context.Payrolls.Remove(payroll);
		await _context.SaveChangesAsync();

		return Ok(payroll);
	}
}
