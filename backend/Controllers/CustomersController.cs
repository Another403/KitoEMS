using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class CustomersController : Controller
{
	private readonly EMSContext _context;
	private readonly UserManager<AppUser> _userManager;
	private readonly IConfiguration _configuration;
	public CustomersController(EMSContext context, UserManager<AppUser> userManager, IConfiguration configuration)
	{
		_context = context;
		_userManager = userManager;
		_configuration = configuration;
	}

	[HttpGet]
	public async Task<ActionResult<List<Customer>>> GetAllCustomers()
	{
		return Ok(await _context.Customers.ToListAsync());
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Customer>> GetCustomerById(Guid id)
	{
		var customer = await _context.Customers.FindAsync(id);

		if (customer == null)
			return NotFound();

		return Ok(customer);
	}

	[HttpPost]
	public async Task<IActionResult> AddCustomer([FromBody] Customer rawCustomer)
	{
		if (rawCustomer == null)
		{
			return BadRequest();
		}

		var newCustomer = new Customer
		{
			Name = rawCustomer.Name,
			PhoneNumber = rawCustomer.PhoneNumber,
			Points = rawCustomer.Points
		};

		try 
		{
			_context.Customers.Add(newCustomer);
			await _context.SaveChangesAsync();
		} 
		catch (DbUpdateException ex)
		{
			return BadRequest(new { message = "Phone number already exists." });
		}
		
		return Ok(newCustomer);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] Customer rawCustomer)
	{
		if (rawCustomer == null)
		{
			return BadRequest(new { message = "rawCustomer is null!" });
		}

		var customer = await _context.Customers.FindAsync(id);

		if (customer == null)
		{
			return NotFound(new { message = "customer not found" });
		}

		customer.Name = rawCustomer.Name;
		customer.Points = rawCustomer.Points;
		customer.PhoneNumber = rawCustomer.PhoneNumber;

		try
		{
			await _context.SaveChangesAsync();
		}
		catch (DbUpdateException ex)
		{
			return BadRequest(new { message = "Phone number already exists." });
		}

		return Ok(customer);
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteCustomer(Guid id)
	{
		var customer = await _context.Customers.FindAsync(id);

		if (customer == null)
		{
			return NotFound(new { message = "customer not found" });
		}

		_context.Customers.Remove(customer);
		await _context.SaveChangesAsync();

		return Ok(customer);
	}
}
