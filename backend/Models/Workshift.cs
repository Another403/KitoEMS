using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Workshift
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid EmployeeId { get; set; }
	public DateTime Start { get; set; }
	public DateTime End { get; set; }
	public string Location { get; set; } = null!;
	public string? ShiftType { get; set; }
	public string? Note { get; set; }
}
