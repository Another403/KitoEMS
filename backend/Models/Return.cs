using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Return
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid OrderId {  get; set; }
	public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
	[Range(0, double.MaxValue)]
	public decimal TotalRefund { get; set; }
}
