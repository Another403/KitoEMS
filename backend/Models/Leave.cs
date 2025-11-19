namespace backend.Models;

public class Leave
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid EmployeeId { get; set; }
	public DateTime StartDate { get; set; }
	public DateTime EndDate { get; set; }
	public string LeaveType { get; set; } = null!;
	public string? Reason { get; set; }
	public string Status { get; set; } = null!;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
