using Microsoft.AspNetCore.Http;

namespace NewLevel.Shared.DTOs.Medias
{
    public class RequestMediaDto
    {
        public string? Src { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile? File { get; set; }
    }
}
