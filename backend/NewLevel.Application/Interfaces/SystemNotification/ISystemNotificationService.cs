using NewLevel.Shared.DTOs.SystemNotification;
using NewLevel.Shared.DTOs.SystemNotifications;

namespace NewLevel.Application.Interfaces.SystemNotification
{
    public interface ISystemNotificationService
    {
        public Task<GeneralNotificationInfoDto> GetAllNotificationByUser();
        public Task<bool> DeleteNotification(int notificationId);
        public Task<bool> ReadNotification(int notificationId);
        public Task<bool> AcceptInvite(int notificationId);
        public Task<bool> DeclineInvite(int notificationId);
        public Task<List<PendingInvitesDto>> GetPendingInvitations();
    }
}
