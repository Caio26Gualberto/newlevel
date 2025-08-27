using Microsoft.Extensions.Configuration;
using NewLevel.Application.Interfaces;
using NewLevel.Shared.DTOs.Auth;
using System.Net;
using System.Net.Mail;

namespace NewLevel.Application.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(EmailDto emailDto)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SMTP");
                
                using var client = new SmtpClient(smtpSettings["Host"], int.Parse(smtpSettings["Port"] ?? "587"))
                {
                    Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
                    EnableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true")
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpSettings["FromEmail"] ?? "", smtpSettings["FromName"] ?? "NewLevel"),
                    Subject = emailDto.Subject,
                    Body = emailDto.Body,
                    IsBodyHtml = emailDto.IsHtml
                };

                mailMessage.To.Add(emailDto.To);

                await client.SendMailAsync(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                // Log error here if needed
                Console.WriteLine($"Erro ao enviar email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string resetToken)
        {
            var frontendUrl = _configuration["Frontend:Url"] ?? "http://localhost:3000";
            var resetLink = $"{frontendUrl}/reset-password?token={resetToken}&email={Uri.EscapeDataString(email)}";

            var emailBody = $@"
                <html>
                <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <div style='background-color: #d32f2f; color: white; padding: 20px; text-align: center;'>
                        <h1>NewLevel - Recuperação de Senha</h1>
                    </div>
                    <div style='padding: 20px; background-color: #f5f5f5;'>
                        <h2>Solicitação de Recuperação de Senha</h2>
                        <p>Você solicitou a recuperação de sua senha. Clique no link abaixo para redefinir sua senha:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <a href='{resetLink}' style='background-color: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                                Redefinir Senha
                            </a>
                        </div>
                        <p><strong>Importante:</strong> Este link expira em 24 horas por motivos de segurança.</p>
                        <p>Se você não solicitou esta recuperação, ignore este email.</p>
                        <hr style='margin: 30px 0; border: none; border-top: 1px solid #ddd;'>
                        <p style='color: #666; font-size: 12px;'>
                            Este é um email automático, não responda a esta mensagem.<br>
                            NewLevel - Plataforma Musical
                        </p>
                    </div>
                </body>
                </html>";

            var emailDto = new EmailDto
            {
                To = email,
                Subject = "NewLevel - Recuperação de Senha",
                Body = emailBody,
                IsHtml = true
            };

            return await SendEmailAsync(emailDto);
        }
    }
}
