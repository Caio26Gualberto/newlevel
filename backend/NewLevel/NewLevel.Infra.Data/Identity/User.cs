using Microsoft.AspNetCore.Identity;
using NewLevel.Domain.Validation;

namespace NewLevel.Infra.Data.Identity
{
    public sealed class User : IdentityUser
    {
        public User()
        {
            
        }
        public User(string refreshToken, DateTime expirationTimeToken)
        {
            ValidateDomainEntity(refreshToken, expirationTimeToken);
        }
        public string RefreshToken { get; private set; }
        public DateTime TokenExpiresIn { get; private set; }

        public void Update(string refreshToken, DateTime expirationTimeToken)
        {
            ValidateDomainEntity(refreshToken, expirationTimeToken);
        }

        private void ValidateDomainEntity(string refreshToken, DateTime expirationTimeToken)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(refreshToken), "Refreshtoken vazio!");
            DomainExceptionValidation.When(expirationTimeToken < DateTime.Now, "Data de expiração para o token inválido!");

            RefreshToken = refreshToken;
            TokenExpiresIn = expirationTimeToken;
        }
    }
}
