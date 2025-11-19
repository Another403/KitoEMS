using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AppUsersController : Controller
{
	private readonly EMSContext _context;
	private readonly UserManager<AppUser> _userManager;
	private readonly IConfiguration _configuration;

	public AppUsersController(EMSContext context, UserManager<AppUser> userManager, IConfiguration configuration)
	{
		_context = context;
		_userManager = userManager;
		_configuration = configuration;
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

	[HttpGet("verify")]
	[Authorize]
	public async Task<IActionResult> VerifyUser()
	{
		var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

		if (userId == null)
			return Unauthorized(new { success = false, error = "Invalid token" });

		var user = await _userManager.FindByIdAsync(userId);

		if (user == null)
			return Unauthorized(new { success = false, error = "User not found" });

		return Ok(new
		{
			success = true,
			user
		});
	}

	[HttpPost("register")]
	public async Task<IActionResult> UserRegister([FromBody] UserRegistration userRegistration)
	{
		if (userRegistration == null)
		{
			return BadRequest(new { message = "new user is null!" });
		}

		AppUser user = new AppUser()
		{
			UserName = userRegistration.Username,
			Email = userRegistration.Email,
			FullName = userRegistration.FullName,
			UserRole = userRegistration.UserRole
		};
		var result = await _userManager.CreateAsync(
			user,
			userRegistration.Password);

		if (result.Succeeded)
			return Ok(result);
		else
			return BadRequest(result);
	}

	[HttpPost("login")]
	public async Task<IActionResult> UserLogin([FromBody] LoginForm loginForm)
	{
		var user = await _userManager.FindByNameAsync(loginForm.Username);

		if (user != null && await _userManager.CheckPasswordAsync(user, loginForm.Password))
		{
			var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:JWTSecret"]!));
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new Claim[]
				{
					new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
				}),
				Expires = DateTime.UtcNow.AddMinutes(15),
				SigningCredentials = new SigningCredentials(
					signInKey,
					SecurityAlgorithms.HmacSha256Signature
					)
			};

			var tokenHandler = new JwtSecurityTokenHandler();
			var securityToken = tokenHandler.CreateToken(tokenDescriptor);
			var token = tokenHandler.WriteToken(securityToken);

			var refreshToken = Guid.NewGuid().ToString();
			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
			await _userManager.UpdateAsync(user);

			return Ok(new { token, refreshToken, user });
		}
		else
		{
			return BadRequest(new { message = "username or password is incorrect" });
		}
	}

	[HttpPost("refreshToken/{refreshToken}")]
	public async Task<IActionResult> RefreshToken(string refreshToken)
	{
		var user = await _userManager.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);

		if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow) 
		{ 
			return Unauthorized();
		}

		var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:JWTSecret"]!));
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(new Claim[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
			}),
			Expires = DateTime.UtcNow.AddMinutes(15),
			SigningCredentials = new SigningCredentials(
				signInKey,
				SecurityAlgorithms.HmacSha256Signature
				)
		};

		var tokenHandler = new JwtSecurityTokenHandler();
		var securityToken = tokenHandler.CreateToken(tokenDescriptor);
		var token = tokenHandler.WriteToken(securityToken);

		return Ok(new { token, refreshToken });
	}

	[HttpDelete("all")]
	public async Task<IActionResult> DeleteAllUsers()
	{
		var users = await _context.AppUsers.ToListAsync();

		_context.AppUsers.RemoveRange(users);

		await _context.SaveChangesAsync();

		return Ok(new { message = "All users deleted" });
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteUserFromList(string id)
	{
		var user = await _context.AppUsers.FindAsync(id);

		if (user == null)
		{
			return NotFound(new { message = "user not found!" });
		}

		_context.AppUsers.Remove(user);
		await _context.SaveChangesAsync();

		return Ok(user);
	}
}
