using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class WorkSchedules
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid EmployeeId { get; set; }
	public DateTime WorkDate { get; set; }
	[Range(1, 3)]
	public int Shift { get; set; }
}
