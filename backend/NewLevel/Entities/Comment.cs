using System.ComponentModel.DataAnnotations.Schema;

namespace NewLevel.Entities
{
    public sealed class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime CreationTime { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public int? PhotoId { get; set; }
        [ForeignKey("PhotoId")]
        public Photo Photo { get; set; }
        public int? MediaId { get; set; }
        [ForeignKey("MediaId")]
        public Media Media { get; set; }
    }
}
