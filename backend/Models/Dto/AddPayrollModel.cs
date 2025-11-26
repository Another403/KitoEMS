using System.ComponentModel.DataAnnotations;

namespace backend.Models.Dto;

public class AddPayrollModel
{
	public string UserId { get; set; } = null!;
	[Range(1, 12)]
	public int Month { get; set; } = 1;
	[Range(2000, 2100)]
	public int Year { get; set; } = 2000;
	[Range(0, double.MaxValue)]
	public decimal BaseSalary { get; set; }
	[Range(0, double.MaxValue)]
	public decimal Bonus { get; set; }
}
