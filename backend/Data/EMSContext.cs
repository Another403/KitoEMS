using backend.Models;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class EMSContext : IdentityDbContext
{
	public EMSContext(DbContextOptions<EMSContext> options) : base(options)
	{
	}

	protected override void OnModelCreating(ModelBuilder builder)
	{
		base.OnModelCreating(builder);

		#region CONSTRAINTS

		builder.Entity<Customer>()
			.HasIndex(c => c.PhoneNumber)
			.IsUnique();

		builder.Entity<Leave>()
			.HasIndex(l => new { l.UserId, l.StartDate, l.EndDate })
			.IsUnique();

		#endregion CONSTRAINTS

		#region RELATIONSHIPS

		builder.Entity<Payroll>()
			.HasOne(p => p.User)
			.WithMany()
			.HasForeignKey(p => p.UserId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.Entity<Receipt>()
			.HasOne(r => r.Customer)
			.WithMany()
			.HasForeignKey(r => r.CustomerPhone)
			.HasPrincipalKey(c => c.PhoneNumber);

		builder.Entity<Receipt>()
			.HasMany(r => r.Items)
			.WithOne(i => i.Receipt)
			.HasForeignKey(i => i.ReceiptId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.Entity<Return>()
			.HasOne(r => r.Receipt)
			.WithMany()
			.HasForeignKey(r => r.ReceiptId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.Entity<Return>()
			.HasMany(r => r.Items)
			.WithOne(i => i.Return)
			.HasForeignKey(i => i.ReturnId)
			.OnDelete(DeleteBehavior.Cascade);

		#endregion RELATIONSHIPS

		#region DECIMAL_PRECISION

		builder.Entity<AppUser>()
				.Property(b => b.Salary)
				.HasPrecision(18, 2);

		builder.Entity<Book>()
				.Property(b => b.Price)
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

		builder.Entity<Receipt>()
		.Property(r => r.Total)
		.HasPrecision(18, 2);

		builder.Entity<ReceiptItem>()
			.Property(ri => ri.UnitPrice)
			.HasPrecision(18, 2);

		#endregion DECIMAL_PRECISION
	}

	public DbSet<AppUser> AppUsers { get; set; }
	public DbSet<Book> Books { get; set; }
	public DbSet<Customer> Customers { get; set; }
	public DbSet<Leave> Leaves { get; set; }
	public DbSet<Payroll> Payrolls { get; set; }
	public DbSet<Return> Returns { get; set; }
	public DbSet<ReturnDetail> ReturnDetails { get; set; }
	public DbSet<StockImport> StockImports { get; set; }
	public DbSet<Storage> Storages { get; set; }
	public DbSet<Workshift> Workshifts { get; set; }
	public DbSet<Receipt> Receipts { get; set; }
	public DbSet<ReceiptItem> ReceiptItems { get; set; }
}