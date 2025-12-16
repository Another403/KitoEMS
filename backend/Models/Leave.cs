namespace backend.Models;

public class Leave
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public string UserId { get; set; } = null!;
	public AppUser? User { get; set; }
	public DateTime StartDate { get; set; }
	public DateTime EndDate { get; set; }
	public string Reason { get; set; } = null!;
	public string Status { get; set; } = null!;
	public string LeaveType { get; set; } = null!;
}
