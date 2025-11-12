using backend.Models;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class EMSContext : IdentityDbContext
{
	public EMSContext(DbContextOptions<EMSContext> options) : base(options) { }

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);
	}

	public DbSet<AppUser> AppUsers { get; set; }
}
