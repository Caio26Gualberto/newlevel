using NewLevel.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public sealed class Photo
    {
        public Photo(string keyS3, string title, string subtitle, string description, bool isPublic, DateTime creationTime, string userId, DateTime captureDate)
        {
            ValidateDomainEntity(keyS3, title, subtitle, description, isPublic, creationTime, userId, publicTimer: null, null, captureDate);
        }
        public int Id { get; private set; }
        public string KeyS3 { get; private set; }
        public string? PrivateURL { get; private set; }
        public string Title { get; private set; }
        public string Subtitle { get; private set; }
        public string Description { get; private set; }
        public DateTime CreationTime { get; private set; }
        public DateTime CaptureDate { get; private set; }
        public DateTime? PublicTimer { get; private set; }
        public bool IsPublic { get; private set; }



        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public List<Comment> Comments { get; set; }

        public void UpdateMedia(string keyS3, string title, string subtitle, string description, bool isPublic, string privateUrl, DateTime publicTimer, DateTime captureDate)
        {
            ValidateDomainEntity(keyS3, title, subtitle, description, isPublic, CreationTime, UserId, publicTimer, privateUrl, captureDate);
        }

        private void ValidateDomainEntity(string keyS3, string title, string subtitle, string? description, bool isPublic, DateTime creationTime, string userId, DateTime? publicTimer, string? privateUrl, DateTime captureDate)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(keyS3), "Não foi posível criar uma chave para o S3");
            DomainExceptionValidation.When(string.IsNullOrEmpty(title) || title.Length < 6 || title.Length > 22, "Título vazio, com mais de 22 ou menos que 6 caracteres");
            DomainExceptionValidation.When(string.IsNullOrEmpty(subtitle) ||  subtitle.Length < 6 || subtitle.Length > 137, "Subtítulo vazio, com mais de 137 ou menos de 6 caracteres");
            DomainExceptionValidation.When(string.IsNullOrEmpty(userId), "UserId nulo");
            DomainExceptionValidation.When(captureDate == null, "Data de captura vazia");

            KeyS3 = keyS3;
            Title = title;
            Subtitle = subtitle;
            Description = description;
            IsPublic = isPublic;
            CreationTime = creationTime;
            UserId = userId;
            PrivateURL = privateUrl;
            PublicTimer = publicTimer;
            CaptureDate = captureDate;
        }
    }
}
