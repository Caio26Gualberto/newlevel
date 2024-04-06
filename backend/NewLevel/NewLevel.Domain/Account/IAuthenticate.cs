namespace NewLevel.Domain.Account
{
    public interface IAuthenticate
    {
        Task<(string, string)> Authenticate(string email, string password);
        Task<bool> RegisterUser(string email, string password);
        Task Logout();
    }
}
