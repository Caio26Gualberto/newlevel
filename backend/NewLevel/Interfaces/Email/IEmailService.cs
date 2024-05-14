namespace NewLevel.Interfaces.Email
{
    public interface IEmailService
    {
        Task SendEmail(string recipient, string subject, string body);
    }
}
