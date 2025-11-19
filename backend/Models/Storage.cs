namespace backend.Models;

public class Storage
{
	public Guid Id { get; set; }
	public int Quantity { get; set; }
	public DateTime lastUpdated { get; set; } = DateTime.UtcNow;
}
