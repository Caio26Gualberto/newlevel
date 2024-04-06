using Microsoft.AspNetCore.Identity;
using NewLevel.Domain.Validation;

namespace NewLevel.Infra.Data.Identity
{
    public sealed class User : IdentityUser
    {
        public User()
        {
            
        }
        public User(string refreshToken)
        {
            ValidateDomainEntity(refreshToken);
        }
        public string RefreshToken { get; private set; }

        public void Update(string refreshToken)
        {
            ValidateDomainEntity(refreshToken);
        }

        private void ValidateDomainEntity(string refreshToken)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(refreshToken), "Refreshtoken vazio!");

            RefreshToken = refreshToken;
        }
    }
}
