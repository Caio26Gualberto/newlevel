using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using NewLevel.Domain.Interfaces;

namespace NewLevel.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendPasswordResetEmailAsync(string email, string resetToken, string resetUrl)
    {
        var subject = "Redefinição de Senha - NewLevel";
        var body = $@"
            <h2>Redefinição de Senha</h2>
            <p>Você solicitou a redefinição de sua senha.</p>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <p><a href='{resetUrl}?token={resetToken}&email={email}'>Redefinir Senha</a></p>
            <p>Este link expira em 1 hora.</p>
            <p>Se você não solicitou esta redefinição, ignore este email.</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendWelcomeEmailAsync(string email, string firstName)
    {
        var subject = "Bem-vindo ao NewLevel!";
        var body = $@"
            <h2>Bem-vindo ao NewLevel, {firstName}!</h2>
            <p>Sua conta foi criada com sucesso.</p>
            <p>Agora você pode fazer login e começar a usar nossa plataforma.</p>
            <p>Obrigado por se juntar a nós!</p>
        ";

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");
        
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(emailSettings["FromName"], emailSettings["FromEmail"]));
        message.To.Add(new MailboxAddress("", toEmail));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = body
        };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["SmtpPort"]!), SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(emailSettings["SmtpUsername"], emailSettings["SmtpPassword"]);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
