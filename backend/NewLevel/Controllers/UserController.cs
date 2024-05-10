using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Interfaces.Services.User;

namespace NewLevel.Controllers
{
    //[Authorize] Descomentar apos implementar a autenticação   TODO
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpDelete("Delete")]
        public async Task<bool> Delete()
        {
            return await _userService.Delete();
        }

        [HttpGet("SkipIntroduction")]
        public async Task SkipIntroduction()
        {
            await _userService.SkipIntroduction();
        }
    }
}
