using System.Text.Json.Serialization;

namespace backend.Models;

public class ReceiptItem
{
	public Guid Id { get; set; }
	public Guid ReceiptId { get; set; }
	[JsonIgnore]
	public Receipt? Receipt { get; set; }

	public Guid BookId { get; set; }
	public Book? Book { get; set; }

	public int Quantity { get; set; }
	public decimal UnitPrice { get; set; }
	public decimal SubTotal => Quantity * UnitPrice;
}
