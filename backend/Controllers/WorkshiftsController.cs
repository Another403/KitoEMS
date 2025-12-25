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
public class WorkshiftsController : ControllerBase
{
	public readonly EMSContext _context;

	public WorkshiftsController(EMSContext context)
	{
		_context = context;
	}

	[HttpGet]
	public async Task<ActionResult<List<Workshift>>> GetAllWorkshifts()
	{
		return Ok(await _context.Workshifts
			.Include(w => w.Employee)
			.ToListAsync());
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Workshift>> GetWorkshiftById(Guid id)
	{
		var workshift = await _context.Workshifts
			.Include(w => w.Employee)
			.FirstOrDefaultAsync(w => w.Id == id);

		if (workshift == null)
		{
			return NotFound(new { message = "workshift not found" });
		}

		return Ok(workshift);
	}

	[HttpPost]
	public async Task<IActionResult> AddWorkshift([FromBody] Workshift workshift)
	{
		if (workshift == null)
		{
			return BadRequest(new {message  = "data is null"});
		}

		var newWorkshift = new Workshift
		{
			Id = workshift.Id == Guid.Empty ? Guid.NewGuid() : workshift.Id,
			EmployeeId = workshift.EmployeeId,
			ShiftType = workshift.ShiftType,
			Start = workshift.Start,
			End = workshift.End,
			Location = workshift.Location,
			Note = workshift.Note,
		};

		_context.Workshifts.Add(newWorkshift);
		await _context.SaveChangesAsync();

		return Ok(newWorkshift);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateWorkshift(Guid id, [FromBody] Workshift updateWorkshift)
	{
		if (updateWorkshift == null)
		{
			return BadRequest(new { message = "data is null" });
		}

		var workshift = await _context.Workshifts.FindAsync(id);

		if (workshift == null)
		{
			return NotFound(new { message = "workshift not found" });
		}

		workshift.EmployeeId = updateWorkshift.EmployeeId;
		workshift.Start = updateWorkshift.Start;
		workshift.End = updateWorkshift.End;
		workshift.Location = updateWorkshift.Location;
		workshift.Note = updateWorkshift.Note;
		workshift.ShiftType = updateWorkshift.ShiftType;

		await _context.SaveChangesAsync();
		return Ok(workshift);
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteWorkshiftById(Guid id)
	{
		var workshift = await _context.Workshifts.FindAsync(id);

		if (workshift == null)
		{
			return NotFound(new { message = "workshift not found" });
		}

		_context.Workshifts.Remove(workshift);
		await _context.SaveChangesAsync();

		return Ok(workshift);
	}
}
