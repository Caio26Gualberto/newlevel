using NewLevel.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public sealed class Media
    {
        public Media(string src, string title, string description, bool isPublic, DateTime creationTime, string userId)
        {
            ValidateDomainEntity(src, title, description, isPublic, creationTime, userId);
        }
        public int Id { get; set; }
        public string Src { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreationTime { get; set; }




        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        public void UpdateMedia(string src, string title, string description, bool isPublic)
        {
            ValidateDomainEntity(src, title, description, isPublic, CreationTime, UserId);
        }

        private void ValidateDomainEntity(string src, string title, string description, bool isPublic, DateTime creationTime, string userId)
        {
            DomainExceptionValidation.When(string.IsNullOrEmpty(userId), "userId nulo");
            DomainExceptionValidation.When(string.IsNullOrEmpty(description), "descrição nula");

            Src = src;
            Title = title;
            Description = description;
            IsPublic = isPublic;
            CreationTime = creationTime;
            UserId = userId;
        }
    }
}
