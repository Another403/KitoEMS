namespace backend.Models;

public class Receipt
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public string? CustomerPhone { get; set; }
	public Customer? Customer { get; set; }

	public string EmployeeId { get; set; } = null!;
	public AppUser? Employee { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public decimal Total { get; set; }
	public int PointsEarned { get; set; }
	public List<ReceiptItem> Items { get; set; } = new();
}
