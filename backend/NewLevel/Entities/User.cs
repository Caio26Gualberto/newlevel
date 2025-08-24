using Microsoft.AspNetCore.Identity;
using NewLevel.Enums.Authenticate;
using NewLevel.Validation;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public class User : IdentityUser<int>
    {
        public User()
        {

        }
        public User(bool isFirstTimeLogin, string nickName, string? avatar, EActivityLocation activityLocation, DateTime? publicTimer, string avatarUrl, string? instrument)
        {
            ValidateDomainEntity(isFirstTimeLogin, nickName, avatar, activityLocation, publicTimer, avatarUrl, null, null, null,
                null, null, instrument, null);
        }
        public string Nickname { get; private set; }
        public string? AvatarKey { get; private set; }
        public string? AvatarUrl { get; private set; }
        public string? Instrument { get; private set; }
        public string? BannerKey { get; private set; }
        public string? BannerUrl { get; private set; }
        public EActivityLocation ActivityLocation { get; private set; }
        public bool IsFirstTimeLogin { get; private set; }
        public bool IsVerified { get; private set; } =  false;
        public DateTime? PublicTimerAvatar { get; private set; }
        public DateTime? PublicTimerBanner { get; private set; }
        public int? BannerPosition { get; private set; }
        [NotMapped]
        public Dictionary<string, string>? IssuesIds { get; private set; } = new Dictionary<string, string>
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


        public virtual List<BandsUsers> BandsUsers { get; private set; }

        [InverseProperty("User")]
        public List<Media> Medias { get; private set; }

        [InverseProperty("User")]
        public List<Photo> Photos { get; private set; }
        public List<Comment> Comments { get; set; }
        public List<SystemNotification> SystemNotifications { get; set; }


        public void Update(bool? isFirstTimeLogin, string? nickName, string? avatarKey, EActivityLocation? activityLocation, DateTime? publicTimer,
            string? avatarUrl, string? email, string? bannerKey, string? bannerUrl, int? bannerPosition, DateTime? publicTimerBanner, string? instrument, bool? isVerified)
        {
            ValidateDomainEntity(isFirstTimeLogin, nickName, avatarKey, activityLocation, publicTimer, avatarUrl, email, bannerKey, bannerUrl,
                bannerPosition, publicTimerBanner, instrument, isVerified);
        }

        private void ValidateDomainEntity(bool? isFirstTimeLogin, string? nickName, string? avatarKey, EActivityLocation? activityLocation, DateTime? publicTimer,
            string? avatarUrl, string? email, string? bannerKey, string? bannerUrl, int? bannerPosition, DateTime? publicTimerBanner, string? instrument, bool? isVerified)
        {

            if (isFirstTimeLogin.HasValue)
                IsFirstTimeLogin = isFirstTimeLogin.Value;

            if (!string.IsNullOrEmpty(nickName))
            {
                DomainExceptionValidation.When(string.IsNullOrWhiteSpace(nickName), "Apelido inválido. Apelido é necessário!");
                Nickname = nickName;
            }

            if (activityLocation != null)
                ActivityLocation = activityLocation.Value;

            if (!string.IsNullOrEmpty(avatarKey))
                AvatarKey = avatarKey;

            if (publicTimer != null)
                PublicTimerAvatar = publicTimer;

            if (!string.IsNullOrEmpty(avatarUrl))
                AvatarUrl = avatarUrl;

            if (!string.IsNullOrEmpty(email))
            {
                DomainExceptionValidation.When(email != null && !email.Contains("@"), "Email inválido, valide o mesmo");
                Email = email;
            }

            if (!string.IsNullOrEmpty(instrument))
                Instrument = instrument;

            if (!string.IsNullOrEmpty(bannerKey))
                BannerKey = bannerKey;

            if (!string.IsNullOrEmpty(bannerUrl))
                BannerUrl = bannerUrl;

            if (bannerPosition != null)
                BannerPosition = bannerPosition.Value;

            if (publicTimerBanner != null)
                PublicTimerBanner = publicTimerBanner;

            if (isVerified != null)
                IsVerified = isVerified.Value;
        }
    }
}
