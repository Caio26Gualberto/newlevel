using NewLevel.Enums;
using NewLevel.Enums.Authenticate;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public class Band
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public string Email { get; private set; }
        public string? SpotifyUrl { get; private set; }
        public string? YoutubeUrl { get; private set; }
        public string? InstagramUrl { get; private set; }
        public bool IsVerified { get; private set; }
        public DateTime CreationTime { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public List<EMusicGenres> MusicGenres { get; private set; }
        [NotMapped]
        public Dictionary<string, string> Integrants { get; private set; }
        public virtual List<BandsUsers> BandsUsers { get; private set; }

        public string IntegrantsSerialized
        {
            get => JsonConvert.SerializeObject(Integrants);
            set => Integrants = JsonConvert.DeserializeObject<Dictionary<string, string>>(value);
        }

        public Band()
        {
        }

        public Band(string name, string description, bool isVerified, DateTime creationTime, DateTime createdAt, List<EMusicGenres> musicGenres, Dictionary<string, string> integrants,
                      bool isFirstTimeLogin, string nickName, string? avatar,
                      EActivityLocation activityLocation, DateTime? publicTimer, string avatarUrl, string email)
        {
            Name = name;
            Description = description;
            IsVerified = isVerified;
            CreationTime = creationTime;
            CreatedAt = createdAt;
            MusicGenres = musicGenres;
            Integrants = integrants;
            Email = email;
        }
    }


}
