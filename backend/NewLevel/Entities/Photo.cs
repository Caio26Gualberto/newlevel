using NewLevel.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public sealed class Photo
    {
        public Photo(string keyS3, string title, string subtitle, string description, bool isPublic, DateTime creationTime, string userId)
        {
            ValidateDomainEntity(keyS3, title, subtitle, description, isPublic, creationTime, userId);
        }
        public int Id { get; private set; }
        public string KeyS3 { get; private set; }
        public string Title { get; private set; }
        public string Subtitle { get; private set; }
        public string Description { get; private set; }
        public DateTime CreationTime { get; private set; }
        public bool IsPublic { get; private set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        public void UpdateMedia(string keyS3, string title, string subtitle, string description, bool isPublic)
        {
            ValidateDomainEntity(keyS3, title, subtitle, description, isPublic, CreationTime, UserId);
        }

        private void ValidateDomainEntity(string keyS3, string title, string subtitle, string? description, bool isPublic, DateTime creationTime, string userId)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(keyS3), "Não foi posível criar uma chave para o S3");
            DomainExceptionValidation.When(string.IsNullOrEmpty(title) || title.Length < 6 || title.Length > 22, "Título vazio, com mais de 22 ou menos que 6 caracteres");
            DomainExceptionValidation.When(string.IsNullOrEmpty(subtitle) ||  subtitle.Length < 6 || subtitle.Length > 137, "Subtítulo vazio, com mais de 137 ou menos de 6 caracteres");
            DomainExceptionValidation.When(string.IsNullOrEmpty(userId), "UserId nulo");

            KeyS3 = keyS3;
            Title = title;
            Subtitle = subtitle;
            Description = description;
            IsPublic = isPublic;
            CreationTime = creationTime;
            UserId = userId;
        }
    }
}
