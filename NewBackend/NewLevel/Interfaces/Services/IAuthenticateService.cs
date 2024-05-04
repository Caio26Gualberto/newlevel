using NewLevel.Dtos;

namespace NewLevel.Interfaces.Services
{
    public interface IAuthenticateService
    {
        Task<TokensDto> Login(string email, string password);
        Task<bool> Register(LoginAndRegisterInputDto input);
        Task<TokensDto> GenerateNewAccessToken(string accessToken);
    }
}
