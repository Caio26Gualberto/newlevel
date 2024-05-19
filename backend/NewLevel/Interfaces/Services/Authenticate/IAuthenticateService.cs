using NewLevel.Dtos.Authenticate;

namespace NewLevel.Interfaces.Services.Authenticate
{
    public interface IAuthenticateService
    {
        Task<LoginResponseDto> Login(string email, string password);
        Task<bool> Logout();
        Task<RegisterResponseDto> Register(RegisterInputDto input);
        Task<TokensDto> GenerateNewAccessToken(string accessToken);
    }
}
