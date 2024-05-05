using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public sealed class Media
    {
        public int Id { get; set; }
        public string Src { get; set; }
        public string Title { get; set; }
        public DateTime CreationTime { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
