﻿using NewLevel.Interfaces.Services.Email;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Web;

public class EmailService : IEmailService
{
    private readonly string _sendGridApiKey;

    public EmailService(IConfiguration configuration)
    {
        _sendGridApiKey = configuration["EmailSettings:SendGrid"] ?? throw new ArgumentNullException("SendGrid ApiKey não configurada!");
    }

    public async Task SendEmail(string recipient, string subject, string body, string templateId = "", object templateObj = null)
    {
        var client = new SendGridClient(_sendGridApiKey);
        var from = new EmailAddress("anewlevelmusic@gmail.com", "A New Level");
        var to = new EmailAddress(recipient);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
        if (!string.IsNullOrEmpty(templateId))
        {
            msg.TemplateId = templateId;
            msg.SetTemplateData(templateObj);
        }

        try
        {
            var response = await client.SendEmailAsync(msg);
            if (response.StatusCode != System.Net.HttpStatusCode.OK && response.StatusCode != System.Net.HttpStatusCode.Accepted)
            {
                throw new Exception($"Failed to send email: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            // Handle error here
            throw new Exception($"Error sending email: {ex.Message}");
        }
    }

    public static (string body, string subject) MakeResetPasswordTemplate(string token, int userId)
    {
        var resetUrl = "http://localhost:3000/security/resetPassword?token=" + HttpUtility.UrlEncode(token) + "&userId=" + HttpUtility.UrlEncode(userId.ToString());

        var subject = "Redefinição de Senha";
        var body = $"<p>Para redefinir sua senha, clique <a href=\"{resetUrl}\">aqui</a>.</p>";

        return (body, subject);
    }
}