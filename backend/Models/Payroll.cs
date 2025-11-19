using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Payroll
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid UserId { get; set; }
	[Range(1, 12)]
	public int Month { get; set; }
	[Range(2000, 2100)]
	public int Year { get; set; }
	[Range(0, double.MaxValue)]
	public decimal BaseSalary { get; set; }
	[Range(0, double.MaxValue)]
	public decimal Bonus { get; set; }
	public decimal Total => Bonus + BaseSalary;
}
