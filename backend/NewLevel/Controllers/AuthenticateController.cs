using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Authenticate;
using NewLevel.Interfaces.Services.Authenticate;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : Controller
    {
        private readonly IAuthenticateService _authenticateService;
        public AuthenticateController(IAuthenticateService authenticateService)
        {
            _authenticateService = authenticateService;
        }

        [HttpPost("Login")]
        public async Task<TokensDto?> Login(LoginInputDto input)
        {
            TokensDto tokens = await _authenticateService.Login(input.Email, input.Password);

            if (!string.IsNullOrEmpty(tokens.Token) && !string.IsNullOrEmpty(tokens.RefreshToken))
                return tokens;

            return null;
        }

        [HttpPost("Register")]
        public async Task<NewLevelResponse<bool>> Register(RegisterInputDto input)
        {
            var result = await _authenticateService.Register(input);

            return new NewLevelResponse<bool>() 
            {
                Data = result,
                IsSuccess = result,
                Message = result ? "User registered successfully" : "User registration failed"
            };
        }

        [Authorize]
        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            return Ok();
        }

        [HttpGet("RenewToken")]
        public async Task<TokensDto?> RenewToken([FromQuery] string accessToken)
        {
            TokensDto tokens = await _authenticateService.GenerateNewAccessToken(accessToken);

            if (!string.IsNullOrEmpty(tokens.Token) && !string.IsNullOrEmpty(tokens.RefreshToken))
                return tokens;

            return null;
        }
    }
}
