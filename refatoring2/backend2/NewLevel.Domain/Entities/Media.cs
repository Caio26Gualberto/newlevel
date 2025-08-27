using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Domain.Entities
{
    public class Media : EntityBase
    {
        public string Src { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsPublic { get; set; } = false;

        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public List<Comment> Comments { get; set; }
    }
}
