using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Authenticate;
using NewLevel.Dtos.SystemNotification;
using NewLevel.Interfaces.Services.SystemNotification;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemNotificationController : Controller
    {
        private readonly ISystemNotification _systemNotification;

        public SystemNotificationController(ISystemNotification systemNotification)
        {
            _systemNotification = systemNotification;
        }

        [HttpGet("GetAllNotificationByUser")]
        public async Task<ActionResult<NewLevelResponse<GeneralNotificationInfoDto>>> GetAllNotificationByUser()
        {
            try
            {
                var resultLogin = await _systemNotification.GetAllNotificationByUser();

                return new NewLevelResponse<GeneralNotificationInfoDto>()
                {
                    Data = resultLogin,
                    IsSuccess = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<GeneralNotificationInfoDto> { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
