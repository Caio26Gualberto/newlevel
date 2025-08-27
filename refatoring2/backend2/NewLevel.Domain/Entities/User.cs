using NewLevel.Domain.Enums.User;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Domain.Entities
{
    public class User : EntityBase
    {
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string? AvatarKey { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Instrument { get; set; }
        public string? BannerKey { get; set; }
        public string? BannerUrl { get; set; }
        public EActivityLocation ActivityLocation { get; set; }
        public bool IsFirstTimeLogin { get; set; }
        public bool IsVerified { get; set; } = false;
        public DateTime? PublicTimerAvatar { get; set; }
        public DateTime? PublicTimerBanner { get; set; }
        public int? BannerPosition { get; set; }
        [NotMapped]
        public Dictionary<string, string>? IssuesIds { get; set; } = new Dictionary<string, string>
        {
            { "IssueId1", "Description of Issue 1" }
        };
        public string? IssuesIdsSerialized
        {
            get => IssuesIds != null ? JsonConvert.SerializeObject(IssuesIds) : null;
            set => IssuesIds = value != null
                ? JsonConvert.DeserializeObject<Dictionary<string, string>>(value)
                : null;
        }

        public virtual List<BandsUsers> BandsUsers { get; set; }

        [InverseProperty("User")]
        public List<Media> Medias { get; set; }

        [InverseProperty("User")]
        public List<Photo> Photos { get; set; }
        public List<Comment> Comments { get; set; }
        public List<SystemNotification> SystemNotifications { get; set; }
    }
}
