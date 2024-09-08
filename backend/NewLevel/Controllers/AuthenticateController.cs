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
        public async Task<ActionResult<NewLevelResponse<LoginResponseDto>>> Login(LoginInputDto input)
        {
            try
            {
                LoginResponseDto resultLogin = await _authenticateService.Login(input.Email, input.Password);

                return new NewLevelResponse<LoginResponseDto>()
                {
                    Data = resultLogin,
                    IsSuccess = resultLogin.IsSuccess,
                    Message = resultLogin.Message
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<LoginResponseDto> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("Register")]
        public async Task<ActionResult<NewLevelResponse<RegisterResponseDto>>> Register(RegisterInputDto input)
        {
            try
            {
                var result = await _authenticateService.Register(input);

                return Ok(new NewLevelResponse<RegisterResponseDto>()
                {
                    Data = result,
                    IsSuccess = result.Result,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<RegisterResponseDto> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("BandRegister")]
        public async Task<ActionResult<NewLevelResponse<RegisterResponseDto>>> BandRegister(RegisterInputDto input)
        {
            try
            {
                var result = await _authenticateService.Register(input);

                return Ok(new NewLevelResponse<RegisterResponseDto>()
                {
                    Data = result,
                    IsSuccess = result.Result,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<RegisterResponseDto> { IsSuccess = false, Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("Logout")]
        public async Task<ActionResult<NewLevelResponse<bool>>> Logout()
        {
            try
            {
                var result = await _authenticateService.Logout();

                if (result)
                    return Ok(new NewLevelResponse<bool>()
                    {
                        Data = result,
                        IsSuccess = result,
                        Message = "Deslogado com sucesso"
                    });

                return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = "Algo deu errado, tente novamente mais tarde" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
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
