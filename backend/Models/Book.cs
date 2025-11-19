using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Book
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public string Name { get; set; } = null!;
	public string Author { get; set; } = null!;

	[Range(0, double.MaxValue)]
	public decimal Price { get; set; } = 0;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}