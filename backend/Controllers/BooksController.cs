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

	[HttpGet("storages")]
	public async Task<ActionResult<List<Storage>>> GetAllBooksStorages()
	{
		return Ok(await _context.Storages.ToListAsync());
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

		var newStorage = new Storage
		{
			Id = newBook.Id,
			Quantity = 0,
		};

		_context.Books.Add(newBook);
		_context.Storages.Add(newStorage);
		await _context.SaveChangesAsync();

		return Ok(newBook);
	}

	[HttpPost("storages")]
	public async Task<IActionResult> AddStorages()
	{
		var books = await _context.Books.ToListAsync();

		foreach (var book in books)
		{
			var newStorage = new Storage
			{
				Id = book.Id,
				Quantity = 0,
			};

			_context.Storages.Add(newStorage);
		}
		await _context.SaveChangesAsync();

		return Ok(await _context.Storages.ToListAsync());
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

	[HttpPut("storages/{id}")]
	public async Task<IActionResult> ImportBook(Guid id, [FromBody] ImportBookModel importBookModel)
	{
		var storage = await _context.Storages.FindAsync(id);

		if (storage == null)
		{
			return NotFound(new { message = "storage not found"});
		}

		storage.Quantity += importBookModel.Quantity;

		await _context.SaveChangesAsync();

		return Ok(storage);
	}

	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteBook(Guid id)
	{
		var book = await _context.Books.FindAsync(id);
		var storage = await _context.Storages.FindAsync(id);

		if (book  == null)
		{
			return NotFound();
		}

		_context.Books.Remove(book);

		if (storage != null)
		{
			_context.Storages.Remove(storage);
		}

		await _context.SaveChangesAsync();

		return Ok(book);
	}
}
