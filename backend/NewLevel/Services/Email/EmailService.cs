using System.Net.Mail;
using System.Net;
using SendGrid;
using SendGrid.Helpers.Mail;
using Newtonsoft.Json.Linq;
using System.Web;
using NewLevel.Interfaces.Services.Email;

public class EmailService : IEmailService
{
    private readonly string _sendGridApiKey = "W";

    public async Task SendEmail(string recipient, string subject, string body)
    {
        var client = new SendGridClient(_sendGridApiKey);
        var from = new EmailAddress("anewlevelmusic@gmail.com", "A New Level");
        var to = new EmailAddress(recipient);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);

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
            Console.WriteLine($"Error sending email: {ex.Message}");
        }
    }

    public static (string body, string subject) MakeResetPasswordTemplate(string token)
    {
        var resetUrl = "http://localhost:3000/security/resetPassword?token=" + HttpUtility.UrlEncode(token);

        var subject = "Redefinição de Senha";
        var body = $"<p>Para redefinir sua senha, clique <a href=\"{resetUrl}\">aqui</a>.</p>";

        return (body, subject);
    }
}