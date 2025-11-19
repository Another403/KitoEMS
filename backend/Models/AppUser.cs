using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class AppUser : IdentityUser
{
	[PersonalData]
	[Column(TypeName = "nvarchar(150)")]
	public string FullName { get; set; } = null!;
	public string? RefreshToken { get; set; }
	public DateTime RefreshTokenExpiry { get; set; }
	public string UserRole { get; set; } = null!;
}