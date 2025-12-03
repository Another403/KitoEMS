namespace backend.Models;

public class Customer
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public string PhoneNumber { get; set; } = null!;
	public string Name { get; set; } = null!;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public int Points { get; set; } = 0;
	public string Rank => GetRank();

	public string GetRank()
	{
		string[] ranks = { "silver", "gold", "platinum", "diamond" };

		int rankIndex = Points / 500;

		if (rankIndex >= ranks.Length)
			rankIndex = ranks.Length - 1;

		return ranks[rankIndex];
	}
}
