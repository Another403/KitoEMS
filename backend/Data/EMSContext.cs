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

		#region CONSTRAINTS
		builder.Entity<Customer>()
			.HasIndex(c => c.PhoneNumber)
			.IsUnique();
		#endregion

		#region RELATIONSHIPS
		builder.Entity<Payroll>()
			.HasOne(p => p.User)
			.WithMany()
			.HasForeignKey(p => p.UserId)
			.OnDelete(DeleteBehavior.Cascade);
		#endregion

		#region DECIMAL_PRECISION
		builder.Entity<AppUser>()
				.Property(b => b.Salary)
				.HasPrecision(18, 2);

		builder.Entity<Book>()
				.Property(b => b.Price)
				.HasPrecision(18, 2);

		builder.Entity<Order>()
			.Property(o => o.Total)
			.HasPrecision(18, 2);

		builder.Entity<OrderDetail>()
			.Property(od => od.Total)
			.HasPrecision(18, 2);

		builder.Entity<Payroll>()
			.Property(p => p.BaseSalary)
			.HasPrecision(18, 2);

		builder.Entity<Payroll>()
			.Property(p => p.Bonus)
			.HasPrecision(18, 2);

		builder.Entity<Return>()
			.Property(r => r.TotalRefund)
			.HasPrecision(18, 2);

		builder.Entity<ReturnDetail>()
			.Property(rd => rd.Refund)
			.HasPrecision(18, 2);
		#endregion
	}

	public DbSet<AppUser> AppUsers { get; set; }
	public DbSet<Book> Books { get; set; }
	public DbSet<Customer> Customers { get; set; }
	public DbSet<Leave> Leaves { get; set; }
	public DbSet<Order> Orders { get; set; }
	public DbSet<OrderDetail> OrderDetails { get; set; }
	public DbSet<Payroll> Payrolls { get; set; }
	public DbSet<Return> Returns { get; set; }
	public DbSet<ReturnDetail> ReturnDetails { get; set; }
	public DbSet<StockImport> StockImports { get; set; }
	public DbSet<Storage> Storages { get; set; }
	public DbSet<WorkSchedules> WorkSchedules { get; set; }
}
