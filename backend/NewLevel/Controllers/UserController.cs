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

        [HttpPost("UploadAvatarImage")]
        public async Task<ActionResult<NewLevelResponse<string>>> UploadAvatarImage(UploadImageInput input)
        {
            try
            {
                await _userService.UploadAvatarImage(input);
                return Ok(new NewLevelResponse<string>
                {
                    IsSuccess = true,
                    Message = "Avatar atualizado com sucesso"
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

        [HttpPost("UploadBannerImage")]
        public async Task<ActionResult<NewLevelResponse<string>>> UploadBannerImage([FromForm]UploadImageInput input)
        {
            try
            {
                await _userService.UploadBannerImage(input);
                return Ok(new NewLevelResponse<string>
                {
                    IsSuccess = true,
                    Message = "Banner atualizado com sucesso!"
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

        [HttpPost("UpdateUser")]
        public async Task<ActionResult<NewLevelResponse<bool>>> UpdateUser(UpdateUserInput input)
        {
            try
            {
                await _userService.UpdateUser(input);
                return Ok(new NewLevelResponse<bool>
                {
                    IsSuccess = true,
                    Message = "Perfil atualizado com sucesso"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }

        [HttpPost("ResetPassword")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ResetPassword(ResetPasswordInput input)
        {
            try
            {
                await _userService.ResetPassword(input);
                return Ok(new NewLevelResponse<bool>
                {
                    IsSuccess = true,
                    Message = "Senha alterada com sucesso!"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }

        [HttpGet("GetProfile")]
        public async Task<ActionResult<NewLevelResponse<ProfileInfoDto>>> GetProfile(string nickname, int userId)
        {
            try
            {
                var dto = await _userService.GetProfile(nickname, userId);
                return Ok(new NewLevelResponse<ProfileInfoDto>
                {
                    IsSuccess = true,
                    Message = "Senha alterada com sucesso!",
                    Data = dto
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<ProfileInfoDto>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }

        [HttpGet("GetUsersForSearchBar")]
        public async Task<ActionResult<NewLevelResponse<List<SearchBarUserDetailDto>>>> GetUsersForSearchBar(string searchTerm)
        {
            try
            {
                var dto = await _userService.GetUsersForSearchBar(searchTerm);
                return Ok(new NewLevelResponse<List<SearchBarUserDetailDto>>
                {
                    Data = dto
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<SearchBarUserDetailDto>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }

        [HttpPost("InviteMemberBand")]
        public async Task<ActionResult<NewLevelResponse<bool>>> InviteMemberBand(InviteMemberInput input)
        {
            try
            {
                var dto = await _userService.InviteMemberBand(input);
                return Ok(new NewLevelResponse<bool>
                {
                    IsSuccess = true,
                    Message = "Membro convidado"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }

        [HttpPost("DeleteInviteMember")]
        public async Task<ActionResult<NewLevelResponse<bool>>> DeleteInviteMember(string nickname)
        {
            try
            {
                var dto = await _userService.DeleteMemberInvite(nickname);
                return Ok(new NewLevelResponse<bool>
                {
                    IsSuccess = true,
                    Message = "Convite deletado"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool>
                {
                    Message = ex.Message,
                    IsSuccess = false
                });
            }
        }
    }
}
