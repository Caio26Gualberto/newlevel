using NewLevel.Domain.Enums.Band;
using NewLevel.Domain.Enums.User;

namespace NewLevel.Shared.DTOs.Auth
{
    public class RegisterInputDto
    {
        public string Email { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public EActivityLocation ActivityLocation { get; set; }
        public List<EMusicGenres>? MusicGenres { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public Dictionary<string, string>? Integrants { get; set; }
    }
}
