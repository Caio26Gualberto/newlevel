using NewLevel.Shared.DTOs.Auth;
using NewLevel.Shared.DTOs.BandVerificationRequests;

namespace NewLevel.Application.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailDto emailDto);
        Task<bool> SendPasswordResetEmailAsync(string email, string resetToken);
        Task<bool> SendBandVerificationRequest(BandVerificationInput input);
        Task<bool> SendEmailVerificationRequest(string token, int userId, string email);
    }
}
