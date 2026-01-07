namespace backend.Models.Dto;

public class CreateReceiptItemModel
{
	public Guid BookId { get; set; }
	public int Quantity { get; set; }
	public decimal UnitPrice { get; set; }
};

public class CreateReceiptModel
{
	public string? CustomerPhone { get; set; }
	public string EmployeeId { get; set; } = null!;
	public List<CreateReceiptItemModel> Items { get; set; } = new();
};

public class ReceiptReturnItemModel
{
	public Guid Id { get; set; }
	public Guid BookId { get; set; }
	public Book? Book { get; set; }
	public int Quantity { get; set; }
	public decimal UnitPrice { get; set; }
	public int ReturnedQuantity { get; set; }
	public int ReturnableQuantity { get; set; }
}