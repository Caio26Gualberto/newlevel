using NewLevel.Enums.Authenticate;

namespace NewLevel.Dtos.User
{
    public class UserInfoResponseDto
    {
        public string Email { get; set; }
        public string Nickname { get; set; }
        public string Password { get; set; }
        public EActivityLocation ActivityLocation { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
