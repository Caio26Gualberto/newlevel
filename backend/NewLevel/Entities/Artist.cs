using NewLevel.Enums;
using NewLevel.Enums.Authenticate;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public class Artist : User
    {
        public string Name { get; private set; }
        public string Description { get; private set; }
        public bool IsVerified { get; private set; }
        public DateTime CreationTime { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public List<EMusicGenres> MusicGenres { get; private set; }
        [NotMapped]
        public Dictionary<string, string> Integrants { get; private set; }

        public string IntegrantsSerialized
        {
            get => JsonConvert.SerializeObject(Integrants);
            set => Integrants = JsonConvert.DeserializeObject<Dictionary<string, string>>(value);
        }

        // Construtor padrão exigido pelo EF
        public Artist() : base()
        {
        }

        public Artist(string name, string description, bool isVerified, DateTime creationTime, DateTime createdAt, List<EMusicGenres> musicGenres, Dictionary<string, string> integrants,
                      bool isFirstTimeLogin, string nickName, string? avatar,
                      EActivityLocation activityLocation, DateTime? publicTimer, string avatarUrl, string email)
            : base(isFirstTimeLogin, nickName, avatar, activityLocation, publicTimer, avatarUrl)
        {
            Name = name;
            Description = description;
            IsVerified = isVerified;
            CreationTime = creationTime;
            CreatedAt = createdAt;
            MusicGenres = musicGenres;
            Integrants = integrants;

            // Herdado de IdentityUser via User
            Email = email;
            UserName = email;
        }
    }


}
