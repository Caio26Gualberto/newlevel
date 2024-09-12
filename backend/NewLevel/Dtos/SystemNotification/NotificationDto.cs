using NewLevel.Enums.SystemNotification;

namespace NewLevel.Dtos.SystemNotification
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
