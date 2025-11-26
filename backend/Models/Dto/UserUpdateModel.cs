namespace backend.Models.Dto;

public class UserUpdateModel
{
	public string Email { get; set; } = null!;
	public string FullName { get; set; } = null!;
	public string Username { get; set; } = null!;
	public string UserRole { get; set; } = null!;
	public decimal Salary { get; set; } = 0;
}
