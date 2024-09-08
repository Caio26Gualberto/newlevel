using NewLevel.Enums;
using NewLevel.Enums.Authenticate;

namespace NewLevel.Dtos.Authenticate
{
    public class RegisterInputDto
    {
        public string Email { get; set; }
        public string Nickname { get; set; }
        public string Password { get; set; }
        public EActivityLocation ActivityLocation { get; set; }
        public EMusicGenres? MusicGenres { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public Dictionary<string, string>? Integrants { get; set; }
    }
}
