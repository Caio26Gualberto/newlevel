using NewLevel.Shared.DTOs.Auth;

namespace NewLevel.Application.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailDto emailDto);
        Task<bool> SendPasswordResetEmailAsync(string email, string resetToken);
    }
}
