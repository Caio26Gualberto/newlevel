using NewLevel.Domain.Enums.Band;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Domain.Entities
{
    public class Band : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Email { get; set; }
        public string? SpotifyUrl { get; set; }
        public string? YoutubeUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public bool IsVerified { get; set; } = false;
        public DateTime CreatedAt { get; set; }
        public List<EMusicGenres> MusicGenres { get; set; }
        [NotMapped]
        public Dictionary<string, string> Integrants { get; set; }
        public virtual List<BandsUsers> BandsUsers { get; set; }
        public List<Event> Events { get; set; }
        public BandVerificationRequest? VerificationRequest { get; set; }
        public string IntegrantsSerialized
        {
            get => JsonConvert.SerializeObject(Integrants);
            set => Integrants = JsonConvert.DeserializeObject<Dictionary<string, string>>(value);
        }
    }
}
