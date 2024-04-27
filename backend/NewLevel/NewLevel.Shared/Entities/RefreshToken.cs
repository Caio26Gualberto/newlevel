using NewLevel.Domain.Validation;

namespace NewLevel.Shared.Entities
{
    public class RefreshToken
    {
        public RefreshToken()
        {

        }
        public RefreshToken(string token, DateTime expirationTimeToken)
        {
            ValidateDomainEntity(token, expirationTimeToken);
        }
        public string Token { get; private set; }
        public DateTime ExpiresIn { get; private set; }

        public void Update(string token, DateTime expirationTimeToken)
        {
            ValidateDomainEntity(token, expirationTimeToken);
        }

        private void ValidateDomainEntity(string token, DateTime expirationTimeToken)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(token), "Refreshtoken vazio!");
            DomainExceptionValidation.When(expirationTimeToken < DateTime.Now, "Data de expiração para o token inválido!");

            Token = token;
            ExpiresIn = expirationTimeToken;
        }
    }
}
