using NewLevel.Domain.Enums.Band;
using NewLevel.Shared.DTOs.User;

namespace NewLevel.Shared.DTOs.Bands
{
    public class UpdateBandInput : UpdateUserInput
    {
        public string? SpotifyUrl { get; set; }
        public string? YoutubeUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? Description { get; set; }
        public List<EMusicGenres>? MusicGenres { get; set; }
    }
}
