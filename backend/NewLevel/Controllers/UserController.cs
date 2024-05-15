using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.User;
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

        [HttpGet("GetUserInfo")]
        public async Task<ActionResult<NewLevelResponse<UserInfoResponseDto>>> GetUserInfo()
        {
            try
            {
                var result = await _userService.GetUserInfo();
                return Ok(new NewLevelResponse<UserInfoResponseDto>
                {
                    Data = result,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<UserInfoResponseDto>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }

        [HttpPost("GenerateTokenToResetPassword")]
        public async Task<ActionResult<NewLevelResponse<string>>> GenerateTokenToResetPassword()
        {
            try
            {
                await _userService.GenerateTokenToResetPassword();
                return Ok(new NewLevelResponse<string>
                {
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<string>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }

        [HttpPost("GenerateTokenToResetPasswordByEmail")]
        public async Task<ActionResult<NewLevelResponse<string>>> ResetPassword(string email)
        {
            try
            {
                await _userService.GenerateTokenToResetPasswordByEmail(email);
                return Ok(new NewLevelResponse<string>
                {
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<string>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }
    }
}
