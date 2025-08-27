using Microsoft.AspNetCore.Http;

namespace NewLevel.Shared.DTOs.User
{
    public class UploadImageInput
    {
        public IFormFile File { get; set; }
        public int? Position { get; set; }
    }
}
