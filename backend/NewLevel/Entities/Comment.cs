using NewLevel.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public sealed class Comment
    {
        public Comment(string text, int userId, int? mediaId, int? photoId, DateTime creationTime)
        {
            ValidateDomainEntity(text, userId, mediaId, photoId, creationTime);   
        }
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreationTime { get; set; }


        public int UserId { get; set; }
        public User User { get; set; }
        public int? MediaId { get; set; }
        public Media Media { get; set; }
        public int? PhotoId { get; set; }
        public Photo Photo { get; set; }

        public void UpdateComment(string text)
        {
            ValidateDomainEntity(text, UserId, MediaId, PhotoId, CreationTime);
        }

        private void ValidateDomainEntity(string text, int userId, int? mediaId, int? photoId, DateTime creationTime)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(text), "Ops comentário vazio");

            Text = text;
            UserId = userId;
            MediaId = mediaId;
            PhotoId = photoId;
            CreationTime = creationTime;
        }
    }
}
