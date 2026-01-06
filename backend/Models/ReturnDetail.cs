using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class ReturnDetail
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid ReturnId { get; set; }
	[JsonIgnore]
	public Return? Return { get; set; }
	public Guid BookId { get; set; }
	public Book? Book { get; set; }

	[Range(0, int.MaxValue)]
	public int Quantity { get; set; }

	[Range(0, double.MaxValue)]
	public decimal Refund { get; set; }
}