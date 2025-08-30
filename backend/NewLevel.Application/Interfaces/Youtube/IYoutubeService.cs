using Microsoft.AspNetCore.Http;

namespace NewLevel.Application.Interfaces.Youtube
{
    public interface IYoutubeService
    {
        public Task<string> UploadVideoToYoutube(IFormFile video, string title, string description);
    }
}
