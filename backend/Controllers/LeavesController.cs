using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class LeavesController : Controller
{
	private readonly EMSContext _context;
	private readonly UserManager<AppUser> _userManager;
	private readonly IConfiguration _configuration;
	public LeavesController(EMSContext context, UserManager<AppUser> userManager, IConfiguration configuration)
	{
		_context = context;
		_userManager = userManager;
		_configuration = configuration;
	}
	[HttpGet]
	public async Task<ActionResult<List<Leave>>> GetAllLeaves()
	{
		return Ok(await _context.Leaves
			.Include(l => l.User)
			.ToListAsync());
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Leave>> GetLeaveById(Guid id)
	{
		var leave = await _context.Leaves
			.Include(l => l.User)
			.FirstOrDefaultAsync(l => l.Id == id);

		if (leave == null)
		{
			return NotFound(new { message = "leave not found!" });
		}

		return Ok(leave);
	}

	[HttpGet("user/{userId}")]
	public async Task<ActionResult<Leave>> GetLeavesByUserId(string userId)
	{
		var leaves = await _context.Leaves
			.Where(l => l.UserId == userId)
			.Include(l => l.User)
			.ToListAsync();

		return Ok(leaves);
	}

	[HttpPost]
	public async Task<IActionResult> AddLeave([FromBody] Leave rawLeave)
	{
		if (rawLeave == null)
		{
			return BadRequest(new { message = "raw data is null!" });
		}

		var leave = new Leave
		{
			UserId = rawLeave.UserId,
			StartDate = rawLeave.StartDate,
			EndDate = rawLeave.EndDate,
			Reason = rawLeave.Reason,
			Status = rawLeave.Status
		};

		try
		{
			_context.Leaves.Add(leave);
			await _context.SaveChangesAsync();
		}
		catch (DbUpdateException ex)
		{
			return BadRequest(new { message = "Leave information already exists." });
		}

		return Ok(leave);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateLeave(Guid id, [FromBody] Leave rawLeave)
	{
		if (rawLeave == null)
		{
			return BadRequest(new { message = "raw data is null!" });
		}

		var leave = await _context.Leaves
			.Include(l => l.User)
			.FirstOrDefaultAsync(l => l.Id == id);

		if (leave == null)
		{
			return NotFound(new { message = "leave not found!" });
		}

		leave.StartDate = rawLeave.StartDate;
		leave.EndDate = rawLeave.EndDate;
		leave.Reason = rawLeave.Reason;
		leave.Status = rawLeave.Status;

		try
		{
			await _context.SaveChangesAsync();
		}
		catch (DbUpdateException ex)
		{
			return BadRequest(new { message = "Leave information already exists." });
		}

		return Ok(leave);
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteLeave(Guid id)
	{
		var leave = await _context.Leaves.FindAsync(id);

		if (leave == null)
		{
			return NotFound(new { message = "leave not found!" });
		}

		_context.Leaves.Remove(leave);
		await _context.SaveChangesAsync();

		return Ok(leave);
	}
}
