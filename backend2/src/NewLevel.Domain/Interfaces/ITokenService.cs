using NewLevel.Domain.Entities;

namespace NewLevel.Domain.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    Task<bool> ValidateRefreshTokenAsync(string refreshToken, string userId);
    Task RevokeRefreshTokenAsync(string userId);
}
