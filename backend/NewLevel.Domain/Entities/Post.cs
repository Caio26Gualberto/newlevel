namespace NewLevel.Domain.Entities
{
    public class Post : EntityBase
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public List<Photo>? Photos { get; set; } = new();
        public List<Media>? Videos { get; set; } = new();
        public List<Comment>? Comments { get; set; } = new();
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
