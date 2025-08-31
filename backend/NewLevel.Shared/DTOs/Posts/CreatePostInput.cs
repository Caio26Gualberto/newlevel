using Microsoft.AspNetCore.Http;

namespace NewLevel.Shared.DTOs.Posts
{
    public class CreatePostInput
    {
        public string GuidSignalR { get; set; }
        public string Text { get; set; }
        public List<IFormFile>? Photos { get; set; }
        public List<IFormFile>? Videos { get; set; }
    }
}
