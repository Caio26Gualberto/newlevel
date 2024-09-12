using NewLevel.Enums.Authenticate;
using NewLevel.Enums.SystemNotification;
using NewLevel.Validation;
using System.ComponentModel.DataAnnotations;

namespace NewLevel.Entities
{
    public sealed class SystemNotification
    {
        public SystemNotification()
        {

        }
        public SystemNotification(string title, string message, ESystemNotificationType notificationType)
        {
            ValidateDomainEntity(title, message, notificationType, null);
        }
        public int Id { get; private set; }
        [Required]
        public string Title { get; private set; }
        [Required]
        public string Message { get; private set; }
        public string? Link { get; private set; }
        public DateTime? Deadline { get; private set; }
        public DateTime CreationTime { get; private set; } = DateTime.Now.AddHours(-3);
        public string? ImageURL { get; private set; }
        public string? HiddenInfos { get; private set; }
        [Required]
        public ESystemNotificationType SystemNotificationType { get; private set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public void Update(string? title, string? message, ESystemNotificationType? notificationType, string? hiddenInfos)
        {
            ValidateDomainEntity(title, message, notificationType, hiddenInfos);
        }

        private void ValidateDomainEntity(string title, string message, ESystemNotificationType? notificationType, string? hiddenInfos)
        {
            Title = title;
            Message = message;

            if (notificationType.HasValue)
                SystemNotificationType = (ESystemNotificationType)notificationType;

            HiddenInfos = hiddenInfos;
        }

    }
}
