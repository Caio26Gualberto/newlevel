using NewLevel.Entities;
using NewLevel.Enums;

namespace NewLevel.Dtos.User
{
    public class ProfileInfoDto
    {
        public string? Name { get; set; }
        public string CityName { get; set; }
        public string? AvatarUrl { get; set; }
        public bool IsEnabledToEdit { get; set; }
        public ArtistDto? Artist { get; set; }
    }

    public class ArtistDto
    {
        public string Description { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<EMusicGenres> MusicGenres { get; set; }
        public Dictionary<string, string> Integrants { get; set; }
    }
}
