using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Services.Auth;
using NewLevel.Shared.DTOs.Auth;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthAppService _authAppService;
        public AuthController(AuthAppService authAppService)
        {
            _authAppService = authAppService;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<NewLevelResponse<LoginResponseDto>>> Login(LoginInputDto input)
        {
            try
            {
                var resultLogin = await _authAppService.Authenticate(input.Email, input.Password);

                return new NewLevelResponse<LoginResponseDto>()
                {
                    Data = new LoginResponseDto
                    {
                        IsSuccess = resultLogin.IsSuccess,
                        Message = resultLogin.Message,
                        Tokens = resultLogin.Tokens != null ? new TokensDto
                        {
                            Token = resultLogin.Tokens.Token,
                            RefreshToken = resultLogin.Tokens.RefreshToken,
                            SkipIntroduction = resultLogin.Tokens.SkipIntroduction
                        } : null
                    },
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
                var result = await _authAppService.Register(input);

                return Ok(new NewLevelResponse<RegisterResponseDto>()
                {
                    Data = new RegisterResponseDto
                    {
                        Result = result.Result,
                        Message = result.Message,
                        UserId = result.UserId
                    },
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
                var result = await _authAppService.BandRegister(input);

                return Ok(new NewLevelResponse<RegisterResponseDto>()
                {
                    Data = new RegisterResponseDto
                    {
                        Result = result.Result,
                        Message = result.Message,
                        UserId = result.UserId
                    },
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
                var result = await _authAppService.Logout();

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

        [HttpPost("RefreshToken")]
        public async Task<ActionResult<NewLevelResponse<TokensDto>>> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            try
            {
                var tokens = await _authAppService.RefreshTokens(request.RefreshToken);

                if (!string.IsNullOrEmpty(tokens.Token) && !string.IsNullOrEmpty(tokens.RefreshToken))
                {
                    return Ok(new NewLevelResponse<TokensDto>
                    {
                        Data = new TokensDto
                        {
                            Token = tokens.Token,
                            RefreshToken = tokens.RefreshToken,
                            SkipIntroduction = tokens.SkipIntroduction
                        },
                        IsSuccess = true,
                        Message = "Tokens renovados com sucesso"
                    });
                }

                return Unauthorized(new NewLevelResponse<TokensDto>
                {
                    IsSuccess = false,
                    Message = "Refresh token inválido ou expirado"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<TokensDto>
                {
                    IsSuccess = false,
                    Message = "Erro interno do servidor: " + ex.Message
                });
            }
        }

        [HttpPost("ForgotPassword")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ForgotPassword(ForgotPasswordRequestDto request)
        {
            try
            {
                var result = await _authAppService.ForgotPassword(request);

                return Ok(new NewLevelResponse<bool>
                {
                    Data = result.IsSuccess,
                    IsSuccess = result.IsSuccess,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> 
                { 
                    IsSuccess = false, 
                    Message = "Erro interno do servidor: " + ex.Message 
                });
            }
        }

        [HttpPost("ResetPassword")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ResetPassword(ResetPasswordRequestDto request)
        {
            try
            {
                var result = await _authAppService.ResetPassword(request);

                return Ok(new NewLevelResponse<bool>
                {
                    Data = result.IsSuccess,
                    IsSuccess = result.IsSuccess,
                    Message = result.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> 
                { 
                    IsSuccess = false, 
                    Message = "Erro interno do servidor: " + ex.Message 
                });
            }
        }
    }
}
