using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Order
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid EmployeeId { get; set; }
	public Guid CustomerId { get; set; }
	[Range(0, int.MaxValue)]
	public int Quantity { get; set; }
	[Range(0, double.MaxValue)]
	public decimal Total { get; set; }
}
