using NewLevel.Shared.Dtos;

namespace NewLevel.Shared.Interfaces.Account
{
    public interface IAuthenticate
    {
        Task<TokensDto> Authenticate(string email, string password);
        Task<bool> RegisterUser(string email, string password);
        Task Logout();
        Task<TokensDto> RenewToken(string token);
    }
}
