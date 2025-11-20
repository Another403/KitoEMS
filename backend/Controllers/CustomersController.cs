using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
			BirthDate = rawCustomer.BirthDate
		};

		_context.Customers.Add(newCustomer);
		await _context.SaveChangesAsync();

		return Ok(newCustomer);
	}
}
