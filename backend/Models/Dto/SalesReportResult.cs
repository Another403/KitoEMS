namespace backend.Models.Dto;

public class BestSellerReportItem
{
	public Guid BookId { get; set; }
	public string Title { get; set; } = string.Empty;
	public int Quantity { get; set; }
}

public class EmployeeRevenueReportItem
{
	public string EmployeeId { get; set; } = string.Empty;
	public string FullName { get; set; } = string.Empty;
	public decimal Revenue { get; set; }
	public int ReceiptCount { get; set; }
}

public class SalesReportResult
{
	public decimal TotalRevenue { get; set; }
	public int TotalReceipts { get; set; }
	public List<BestSellerReportItem> BestSelling { get; set; } = new();
}