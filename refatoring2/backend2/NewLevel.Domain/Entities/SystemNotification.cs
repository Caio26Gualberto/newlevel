using NewLevel.Domain.Enums.SystemNotification;
using System.ComponentModel.DataAnnotations;

namespace NewLevel.Domain.Entities
{
    public class SystemNotification : EntityBase
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Message { get; set; }
        public string? Link { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime? Deadline { get; set; }
        public string? ImageURL { get; set; }
        public string? HiddenInfos { get; set; }
        [Required]
        public ESystemNotificationType SystemNotificationType { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
