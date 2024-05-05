using NewLevel.Enums;

namespace NewLevel.Dtos
{
    public class RegisterInputDto
    {
        public string Email { get; set; }   
        public string Nickname { get; set; }
        public string Password { get; set; }
        public EActivityLocation ActivityLocation { get; set; }
    }
}
