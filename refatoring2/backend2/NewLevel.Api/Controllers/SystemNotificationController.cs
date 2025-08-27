using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.SystemNotification;
using NewLevel.Shared.DTOs.SystemNotification;
using NewLevel.Shared.DTOs.SystemNotifications;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemNotificationController : ControllerBase
    {
        private readonly ISystemNotificationService _systemNotificationService;

        public SystemNotificationController(ISystemNotificationService systemNotification)
        {
            _systemNotificationService = systemNotification;
        }

        [HttpGet("GetAllNotificationByUser")]
        public async Task<ActionResult<NewLevelResponse<GeneralNotificationInfoDto>>> GetAllNotificationByUser()
        {
            try
            {
                var result = await _systemNotificationService.GetAllNotificationByUser();

                return new NewLevelResponse<GeneralNotificationInfoDto>()
                {
                    Data = result,
                    IsSuccess = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<GeneralNotificationInfoDto> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpDelete("DeleteNotification")]
        public async Task<ActionResult<NewLevelResponse<bool>>> DeleteNotification(int notificationId)
        {
            try
            {
                var result = await _systemNotificationService.DeleteNotification(notificationId);

                return new NewLevelResponse<bool>()
                {
                    IsSuccess = true,
                    Message = "Notificação deletada"
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPatch("ReadNotification")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ReadNotification(int notificationId)
        {
            try
            {
                var result = await _systemNotificationService.ReadNotification(notificationId);

                return new NewLevelResponse<bool>()
                {
                    IsSuccess = true
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPut("RespondToInvite")]
        public async Task<ActionResult<NewLevelResponse<bool>>> RespondToInvite(int notificationId, bool isAccept)
        {
            try
            {
                bool result;

                if (isAccept)
                {
                    result = await _systemNotificationService.AcceptInvite(notificationId);
                    if (result)
                    {
                        return new NewLevelResponse<bool>
                        {
                            IsSuccess = true,
                            Message = "Convite aceito"
                        };
                    }
                }
                else
                {
                    result = await _systemNotificationService.DeclineInvite(notificationId);
                    if (result)
                    {
                        return new NewLevelResponse<bool>
                        {
                            IsSuccess = true,
                            Message = "Convite recusado"
                        };
                    }
                }

                return new NewLevelResponse<bool>
                {
                    IsSuccess = false,
                    Message = "Algo deu errado, por favor entre em contato com o desenvolvedor"
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool>
                {
                    IsSuccess = false,
                    Message = $"Erro interno: {ex.Message}"
                });
            }
        }

        [HttpGet("GetPendingInvitations")]
        public async Task<ActionResult<NewLevelResponse<List<PendingInvitesDto>>>> GetPendingInvitations()
        {
            try
            {
                var result = await _systemNotificationService.GetPendingInvitations();

                return new NewLevelResponse<List<PendingInvitesDto>>()
                {
                    IsSuccess = true,
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<List<PendingInvitesDto>> { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
