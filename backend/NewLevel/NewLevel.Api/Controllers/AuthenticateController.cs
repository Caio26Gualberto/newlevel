using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.Dtos;
using NewLevel.Domain.Account;

namespace NewLevel.Api.Controllers
{
    [Route("newLevel/[controller]")]
    [ApiController]
    public class AuthenticateController : Controller
    {
        private readonly IAuthenticate _authenticate;
        public AuthenticateController(IAuthenticate authenticate)
        {
            _authenticate = authenticate;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginAndRegisterInputDto input)
        {
            var result = await _authenticate.Authenticate(input.Email, input.Password);

            if (!string.IsNullOrEmpty(result))
                return Ok(new { Token = result });

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(LoginAndRegisterInputDto input)
        {
            var result = await _authenticate.RegisterUser(input.Email, input.Password);
            return View();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            return View();
        }
    }
}
