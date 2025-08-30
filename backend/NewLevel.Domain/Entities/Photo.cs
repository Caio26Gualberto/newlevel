using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace NewLevel.Domain.Entities
{
    public class Photo : EntityBase
    {
        public string KeyS3 { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public DateTime CaptureDate { get; set; }
        public bool IsPublic { get; set; } = false;


        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public List<Comment>? Comments { get; set; }
        public int? EventId { get; set; }
        public Event? Event { get; set; }
        public int PostId { get; set; }
        public Post? Post { get; set; } = null!;
    }
}
