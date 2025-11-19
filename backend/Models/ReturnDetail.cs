using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class ReturnDetail
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid ReturnId { get; set; }
	public Guid BookId { get; set; }
	[Range(0, int.MaxValue)]
	public int Quantity { get; set; }
	[Range(0, double.MaxValue)]
	public decimal Refund { get; set; }
}
