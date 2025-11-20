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
public class BooksController : Controller
{
	private readonly EMSContext _context;
	private readonly UserManager<AppUser> _userManager;
	private readonly IConfiguration _configuration;
	public BooksController(EMSContext context, UserManager<AppUser> userManager, IConfiguration configuration)
	{
		_context = context;
		_userManager = userManager;
		_configuration = configuration;
	}

	[HttpGet]
	public async Task<ActionResult<List<Book>>> GetAllBooks()
	{
		return Ok(await _context.Books.ToListAsync());
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<Book>> GetBookById(Guid id)
	{
		var book = await _context.Books.FindAsync(id);

		if (book == null)
			return NotFound();

		return Ok(book);
	}

	[HttpPost]
	public async Task<IActionResult> AddBook([FromBody] Book rawBook)
	{
		if (rawBook == null)
		{
			return BadRequest();
		}

		var newBook = new Book
		{
			Name = rawBook.Name,
			Author = rawBook.Author,
			Price = rawBook.Price
		};

		_context.Books.Add(newBook);
		await _context.SaveChangesAsync();

		return Ok(newBook);
	}

	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateBook(Guid id, [FromBody] Book updateBook)
	{
		var book = await _context.Books.FindAsync(id);

		if (book == null)
		{
			return NotFound();
		}

		book.Name = updateBook.Name;
		book.Author = updateBook.Author;
		book.Price = updateBook.Price;

		await _context.SaveChangesAsync();

		return Ok(book);
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteBook(Guid id)
	{
		var book = await _context.Books.FindAsync(id);

		if (book  == null)
		{
			return NotFound();
		}

		_context.Books.Remove(book);
		await _context.SaveChangesAsync();

		return Ok(book);
	}
}
