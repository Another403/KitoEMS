using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;
public class AppUsersController : Controller
{
	public IActionResult Index()
	{
		return View();
	}
}
