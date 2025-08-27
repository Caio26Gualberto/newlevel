namespace NewLevel.Interfaces.Services.Email
{
    public interface IEmailService
    {
        Task SendEmail(string recipient, string subject, string body, string templateId = "", object templateObj = null);
    }
}
