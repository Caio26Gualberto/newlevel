using Microsoft.AspNetCore.Identity;
using NewLevel.Enums.Authenticate;
using NewLevel.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public sealed class User : IdentityUser
    {
        public User()
        {
                
        }
        public User(bool isFirstTimeLogin, string nickName, string? avatar, EActivityLocation activityLocation)
        {
            ValidateDomainEntity(isFirstTimeLogin, nickName, avatar, activityLocation);
        }
        public string Nickname { get; private set; }
        public string? Avatar { get; private set; }
        public EActivityLocation ActivityLocation { get; private set; }
        public bool IsFirstTimeLogin { get; private set; }
        [InverseProperty("User")]
        public List<Media> Medias { get; private set; }
        [InverseProperty("User")]
        public List<Photo> Photos { get; private set; }

        public void Update(bool? isFirstTimeLogin, string nickName, string? avatar, EActivityLocation activityLocation)
        {
            ValidateDomainEntity(isFirstTimeLogin, nickName, avatar, activityLocation);
        }

        private void ValidateDomainEntity(bool? isFirstTimeLogin, string nickName, string? avatar, EActivityLocation activityLocation)
        {
            DomainExceptionValidation.When(string.IsNullOrWhiteSpace(nickName), "Apelido inválido. Apelido é necessário!");  

            if (isFirstTimeLogin.HasValue)
                IsFirstTimeLogin = isFirstTimeLogin.Value;

            Nickname = nickName;
            ActivityLocation = activityLocation;
            Avatar = avatar;
        }
    }
}
