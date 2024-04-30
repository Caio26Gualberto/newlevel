using Microsoft.AspNetCore.Identity;
using NewLevel.Validation;

namespace NewLevel.Entities
{
    public sealed class User : IdentityUser
    {
        public User()
        {

        }
        public User(bool isFirstTimeLogin)
        {
            ValidateDomainEntity(isFirstTimeLogin);
        }
        public bool IsFirstTimeLogin { get; private set; } = true;

        public void Update(bool? isFirstTimeLogin)
        {
            ValidateDomainEntity(isFirstTimeLogin);
        }

        private void ValidateDomainEntity(bool? isFirstTimeLogin)
        {

            if (isFirstTimeLogin.HasValue)
                IsFirstTimeLogin = isFirstTimeLogin.Value;
        }
    }
}
