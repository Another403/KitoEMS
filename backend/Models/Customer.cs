namespace backend.Models;

public class Customer
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public string PhoneNumber { get; set; } = null!;
	public string Name { get; set; } = null!;
	public DateTime? BirthDate { get; set; }
	public int Points { get; set; } = 0;
	public string Rank { get; set; } = "silver";
}
