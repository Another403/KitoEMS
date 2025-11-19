using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class StockImport
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid BookId { get; set; }
	[Range(0, int.MaxValue)]
	public int Quantity { get; set; }
	public DateTime importDate = DateTime.UtcNow;
}
