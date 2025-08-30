using NewLevel.Shared.DTOs.Comments;
using NewLevel.Shared.DTOs.Medias;
using NewLevel.Shared.DTOs.Photos;

namespace NewLevel.Shared.DTOs.Posts
{
    public class PostDto
    {
        public int PostId { get; set; }
        public int CommentsCount { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<CommentsListDto>? Comments { get; set; } = new();
        public List<PhotoResponseDto>? Photos { get; set; } = new();
        public List<MediaDto> Medias { get; set; } = new();
    } 
}
