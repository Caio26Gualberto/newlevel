using NewLevel.Domain.Enums.User;

namespace NewLevel.Domain.Interfaces.Authenticate
{
    public interface IAuthenticateService
    {
        Task<bool> Authenticate(string email, string password);
        Task<bool> RegisterUser(string email, string password, string nickname, EActivityLocation activityLocation);
        Task Logout();
        Task<string?> GeneratePasswordResetTokenAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
        
        // JWT Methods
        Task<string> GenerateJwtToken(string email);
        Task<string> GenerateRefreshToken();
        Task<bool> ValidateRefreshToken(string refreshToken);
        Task<string?> GetEmailFromRefreshToken(string refreshToken);
        Task SaveRefreshToken(string email, string refreshToken);
        Task<bool> RemoveRefreshToken(string refreshToken);
    }
}
