using NewLevel.Dtos;

namespace NewLevel.Interfaces.Services
{
    public interface IAuthenticateService
    {
        Task<TokensDto> Login(string email, string password);
        Task<bool> Register(RegisterInputDto input);
        Task<TokensDto> GenerateNewAccessToken(string accessToken);
    }
}
