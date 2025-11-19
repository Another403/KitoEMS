using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class OrderDetail
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid OrderId { get; set; }
	public Guid BookId { get; set; }
	[Range(0, int.MaxValue)]
	public int Quantity { get; set; }
	public decimal Total { get; set; }
}
