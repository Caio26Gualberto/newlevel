using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.User;
using NewLevel.Shared.DTOs.User;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpDelete("Delete")]
        public async Task<ActionResult<NewLevelResponse<bool>>> Delete()
        {
            try
            {
                var result = await _userService.DeleteAsync();

                return Ok(new NewLevelResponse<bool> { IsSuccess = result, Data = result });
            }
            catch (Exception ex)
            {
               return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message, Data = false });
            } 
        }

        [HttpPatch("SkipIntroduction")]
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
        public async Task<ActionResult<NewLevelResponse<string>>> UploadBannerImage([FromForm] UploadImageInput input)
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

        [HttpPut("UpdateUser")]
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

        [HttpGet("GetProfile")]
        public async Task<ActionResult<NewLevelResponse<ProfileInfoDto>>> GetProfile(string nickname, int userId)
        {
            try
            {
                var dto = await _userService.GetProfile(nickname, userId);
                return Ok(new NewLevelResponse<ProfileInfoDto>
                {
                    IsSuccess = true,
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

        [HttpDelete("DeleteInviteMember")]
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

        [HttpPost("ChangePassword")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ChangePassword()
        {
            try
            {
                var result = await _userService.ChangePassword();
                return Ok(new NewLevelResponse<bool>
                {
                    IsSuccess = true,
                    Message = "Link de redefinição de senha enviado para o seu Email"
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
