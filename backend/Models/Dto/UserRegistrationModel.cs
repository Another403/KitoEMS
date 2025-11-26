namespace backend.Models.Dto;

public class UserRegistrationModel
{
	public string Email { get; set; } = null!;
	public string Password { get; set; } = null!;
	public string FullName { get; set; } = null!;
	public string Username { get; set; } = null!;
	public string UserRole { get; set; } = null!;
	public decimal Salary { get; set; } = 0;
	public IFormFile? Image { get; set; }
}
