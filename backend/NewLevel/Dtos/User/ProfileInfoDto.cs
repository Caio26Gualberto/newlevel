using NewLevel.Entities;
using NewLevel.Enums;

namespace NewLevel.Dtos.User
{
    public class ProfileInfoDto
    {
        public string? Name { get; set; }
        public BannerInfos? Banner { get; set; }
        public string CityName { get; set; }
        public string? AvatarUrl { get; set; }
        public bool IsEnabledToEdit { get; set; }
        public BandDto? Band { get; set; }
        public List<ProfileInfoPhotoDto>? ProfileInfoPhotos { get; set; }
        public List<ProfileInfoVideoDto>? ProfileInfoVideos { get; set; }
    }

    public class BandDto
    {
        public string Description { get; set; }
        public string? InstagramUrl { get; set; }
        public string? YoutubeUrl { get; set; }
        public string? SpotifyUrl { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<EMusicGenres> MusicGenres { get; set; }
        public Dictionary<string, string> Integrants { get; set; }
        public List<IntegrantInfoDto>? IntegrantsWithUrl { get; set; }
    }

    public class IntegrantInfoDto
    {
        public string Name { get; set; }
        public string Instrument { get; set; }
        public string ProfileUrl { get; set; }

    }

    public class ProfileInfoPhotoDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string PhotoSrc { get; set; }
    }

    public class ProfileInfoVideoDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string MediaSrc { get; set; }
    }

    public class BannerInfos
    {
        public string? URL { get; set; }
        public int? Position { get; set; }
    }
}
