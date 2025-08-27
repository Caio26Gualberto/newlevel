namespace NewLevel.Dtos.User
{
    public class ResetPasswordInput
    {
        public string Password { get; set; }
        public string PasswordConfirmation { get; set; }
        public string Token { get; set; }
        public string UserId { get; set; }
    }
}
