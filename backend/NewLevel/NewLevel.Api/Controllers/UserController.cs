using Microsoft.AspNetCore.Mvc;
using NewLevel.Shared.Interfaces.User;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet("SkipPresentation")]
        public async Task<IActionResult> SkipPresentation()
        {
            var isSucceeded = _userService.SkipPresentation();
            return View();
        }
    }
}
