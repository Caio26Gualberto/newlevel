using Microsoft.AspNetCore.Http;

namespace NewLevel.Shared.DTOs.Photos
{
    public class PhotoArchiveInput
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public string TakeAt { get; set; }
        public IFormFile File { get; set; }
    }
}
