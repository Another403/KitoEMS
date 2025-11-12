using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AppUsersController : Controller
{
	private readonly EMSContext _context;
	private readonly UserManager<AppUser> _userManager;

	public AppUsersController(EMSContext context, UserManager<AppUser> userManager)
	{
		_context = context;
		_userManager = userManager;
	}

	[HttpGet]
	public async Task<ActionResult<List<AppUser>>> GetUsersList()
	{
		return Ok(await _context.AppUsers.ToListAsync());
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<AppUser>> GetUserById(string id)
	{
		var user = await _context.AppUsers.FindAsync(id);

		if (user == null)
		{
			return BadRequest(new { message = "this user does not exist" });
		}

		return Ok(user);
	}

	[HttpPost("/register")]
	public async Task<IActionResult> UserRegister([FromBody] UserRegistration userRegistration)
	{
		if (userRegistration == null)
		{
			return BadRequest(new { message = "new user is null!" });
		}

		AppUser user = new AppUser()
		{
			UserName = userRegistration.Email,
			Email = userRegistration.Email,
			FullName = userRegistration.FullName,
		};
		var result = await _userManager.CreateAsync(
			user,
			userRegistration.Password);

		if (result.Succeeded)
			return Ok(result);
		else
			return BadRequest(result);
	}
}
