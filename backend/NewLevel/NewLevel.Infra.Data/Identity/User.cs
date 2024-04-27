using Microsoft.AspNetCore.Identity;
using NewLevel.Domain.Validation;
using NewLevel.Shared.Entities;

namespace NewLevel.Infra.Data.Identity
{
    public sealed class User : IdentityUser
    {
        public User()
        {

        }
        public User(RefreshToken? refreshToken, DateTime expirationTimeToken, bool isFirstTimeLogin)
        {
            ValidateDomainEntity(refreshToken, expirationTimeToken, isFirstTimeLogin);
        }
        public DateTime TokenExpiresIn { get; private set; }
        public bool IsFirstTimeLogin { get; private set; } = true;
        public RefreshToken RefreshToken { get; set; }
        public int RefreshTokenId { get; set; }

        public void Update(RefreshToken? refreshToken, DateTime expirationTimeToken, bool? isFirstTimeLogin)
        {
            ValidateDomainEntity(refreshToken, expirationTimeToken, isFirstTimeLogin);
        }

        private void ValidateDomainEntity(RefreshToken? refreshToken, DateTime expirationTimeToken, bool? isFirstTimeLogin)
        {
            DomainExceptionValidation.When(refreshToken != null, "Refreshtoken vazio!");
            DomainExceptionValidation.When(expirationTimeToken < DateTime.Now, "Data de expiração para o token inválido!");

            RefreshToken = refreshToken!;
            TokenExpiresIn = expirationTimeToken;

            if (isFirstTimeLogin.HasValue)
                IsFirstTimeLogin = isFirstTimeLogin.Value;
        }
    }
}
