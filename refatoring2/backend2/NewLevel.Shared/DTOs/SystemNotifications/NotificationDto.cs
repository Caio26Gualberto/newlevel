using NewLevel.Domain.Enums.SystemNotification;

namespace NewLevel.Shared.DTOs.SystemNotification
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public ESystemNotificationType NotificationType { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
