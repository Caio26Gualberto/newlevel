using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Band;
using NewLevel.Dtos.SystemNotification;
using NewLevel.Interfaces.Services.Band;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BandController : Controller
    {
        private readonly IBandService _bandService;
        public BandController(IBandService bandService)
        {
            _bandService = bandService;
        }

        [HttpGet("GetAllBandMembers")]
        public async Task<ActionResult<NewLevelResponse<List<MemberInfoDto>>>> GetAllBandMembers()
        {
            try
            {
                var result = await _bandService.GetAllBandMembers();

                return new NewLevelResponse<List<MemberInfoDto>>()
                {
                    Data = result,
                    IsSuccess = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<List<MemberInfoDto>> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpGet("GetBandByUser")]
        public async Task<ActionResult<NewLevelResponse<BandInfoByUser>>> GetBandByUser()
        {
            try
            {
                var result = await _bandService.GetBandByUser();

                return new NewLevelResponse<BandInfoByUser>()
                {
                    Data = result,
                    IsSuccess = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<BandInfoByUser> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpDelete("RemoveMemberByUserId")]
        public async Task<ActionResult<NewLevelResponse<bool>>> RemoveMemberByUserId(int userId)
        {
            try
            {
                var result = await _bandService.RemoveMemberByUserId(userId);

                return new NewLevelResponse<bool>()
                {
                    IsSuccess = true,
                    Message = "Membro removido com sucesso"
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
