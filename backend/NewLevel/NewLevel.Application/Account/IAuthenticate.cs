namespace NewLevel.Domain.Account
{
    public interface IAuthenticate
    {
        Task<TokenDto> Authenticate(string email, string password);
        Task<bool> RegisterUser(string email, string password);
        Task Logout();
        Task<(string, string)> RenewToken(string token);
    }
}
