using NewLevel.Dtos.Authenticate;

namespace NewLevel.Interfaces.Services.Authenticate
{
    public interface IAuthenticateService
    {
        Task<TokensDto> Login(string email, string password);
        Task<bool> Register(RegisterInputDto input);
        Task<TokensDto> GenerateNewAccessToken(string accessToken);
    }
}
