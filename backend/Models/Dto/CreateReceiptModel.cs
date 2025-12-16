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
