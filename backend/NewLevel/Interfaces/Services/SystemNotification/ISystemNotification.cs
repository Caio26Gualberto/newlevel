using NewLevel.Dtos.SystemNotification;

namespace NewLevel.Interfaces.Services.SystemNotification
{
    public interface ISystemNotification
    {
        Task<GeneralNotificationInfoDto> GetAllNotificationByUser();
    }
}
