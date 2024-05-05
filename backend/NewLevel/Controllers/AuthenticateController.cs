using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos;
using NewLevel.Interfaces.Services;

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
        public async Task<NewLevelResponse<string>> Register(RegisterInputDto input)
        {
            var result = await _authenticateService.Register(input);

            if (result)
                return new NewLevelResponse<string> { IsSuccess = true, Message = "Usuário criado com sucesso!" };

            return new NewLevelResponse<string> {IsSuccess = false, Message = "Algo deu errado, tente novamente mais tarde! Caso o problema persista entrar em contato com o desenvolvedor" };
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
