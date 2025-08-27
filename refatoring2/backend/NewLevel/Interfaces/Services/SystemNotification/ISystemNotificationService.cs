using NewLevel.Dtos.SystemNotification;

namespace NewLevel.Interfaces.Services.SystemNotification
{
    public interface ISystemNotificationService
    {
        Task<GeneralNotificationInfoDto> GetAllNotificationByUser();
        Task<bool> DeleteNotification(int notificationId);
        Task<bool> ReadNotification(int notificationId);
        Task<bool> AcceptInvite(int notificationId);
        Task<bool> DeclineInvite(int notificationId);
        Task<List<PendingInvitesDto>> GetPendingInvitations();
    }
}
