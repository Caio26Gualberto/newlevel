using Microsoft.AspNetCore.Identity;
using NewLevel.Enums.Authenticate;
using NewLevel.Validation;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public class User : IdentityUser
    {
        public User()
        {
                
        }
        public User(bool isFirstTimeLogin, string nickName, string? avatar, EActivityLocation activityLocation, DateTime? publicTimer, string avatarUrl, string? instrument = "")
        {
            ValidateDomainEntity(isFirstTimeLogin, nickName, avatar, activityLocation, publicTimer, avatarUrl, null, instrument);
        }
        public string Nickname { get; private set; }
        public string? AvatarKey { get; private set; }
        public string? AvatarUrl { get; private set; }
        public string? Instrument { get; private set; }
        public EActivityLocation ActivityLocation { get; private set; }
        public bool IsFirstTimeLogin { get; private set; }
        public DateTime? PublicTimer { get; private set; }
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


        public void Update(bool? isFirstTimeLogin, string nickName, string? avatarKey, EActivityLocation activityLocation, DateTime? publicTimer, string avatarUrl, string? email, string? instrument = "")
        {
            ValidateDomainEntity(isFirstTimeLogin, nickName, avatarKey, activityLocation, publicTimer, avatarUrl, email, instrument);
        }

        private void ValidateDomainEntity(bool? isFirstTimeLogin, string nickName, string? avatarKey, EActivityLocation activityLocation, DateTime? publicTimer,
            string avatarUrl, string? email, string? instrument)
        {
            DomainExceptionValidation.When(string.IsNullOrWhiteSpace(nickName), "Apelido inválido. Apelido é necessário!");  
            DomainExceptionValidation.When(email != null && !email.Contains("@"), "Email inválido, valide o mesmo");

            if (isFirstTimeLogin.HasValue)
                IsFirstTimeLogin = isFirstTimeLogin.Value;

            Nickname = nickName;
            ActivityLocation = activityLocation;
            AvatarKey = avatarKey;
            PublicTimer = publicTimer;
            AvatarUrl = avatarUrl;
            Email = email;
        }
    }
}
