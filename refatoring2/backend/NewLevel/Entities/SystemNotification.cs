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
            ValidateDomainEntity(title, message, notificationType, null, false, false);
        }
        public int Id { get; private set; }
        [Required]
        public string Title { get; private set; }
        [Required]
        public string Message { get; private set; }
        public string? Link { get; private set; }
        public bool IsRead { get; private set; } = false;
        public bool IsDeleted { get; private set; } = false;
        public DateTime? Deadline { get; private set; }
        public DateTime CreationTime { get; private set; } = DateTime.Now.AddHours(-3);
        public string? ImageURL { get; private set; }
        public string? HiddenInfos { get; private set; }
        [Required]
        public ESystemNotificationType SystemNotificationType { get; private set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public void Update(string? title, string? message, ESystemNotificationType? notificationType, string? hiddenInfos, bool isRead, bool isDeleted)
        {
            ValidateDomainEntity(title, message, notificationType, hiddenInfos, isRead, isDeleted);
        }

        private void ValidateDomainEntity(string title, string message, ESystemNotificationType? notificationType, string? hiddenInfos, bool isRead, bool isDeleted)
        {
            Title = title;
            Message = message;

            if (notificationType.HasValue)
                SystemNotificationType = (ESystemNotificationType)notificationType;

            HiddenInfos = hiddenInfos;
            IsRead = isRead;
            IsDeleted = isDeleted;
        }

    }
}
