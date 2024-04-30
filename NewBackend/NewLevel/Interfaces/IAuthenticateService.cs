using NewLevel.Dtos;

namespace NewLevel.Interfaces
{
    public interface IAuthenticateService
    {
        Task<TokensDto> Login(string email, string password);
        Task<bool> Register(string email, string password);
        Task<TokensDto> GenerateNewAccessToken(string accessToken);
    }
}
