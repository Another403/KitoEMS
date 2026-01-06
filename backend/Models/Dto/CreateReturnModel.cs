namespace backend.Models.Dto;

public class CreateReturnModel
{
	public Guid ReceiptId { get; set; }
	public List<ReturnItemModel> Items { get; set; } = new();
}

public class ReturnItemModel
{
	public Guid BookId { get; set; }
	public int Quantity { get; set; }
}