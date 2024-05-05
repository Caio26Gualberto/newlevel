using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos;
using NewLevel.Interfaces.Services;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController
    {
        private readonly IMediaService _mediaService;
        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        [HttpGet("GetMedia")]
        public async Task<NewLevelResponse<List<MediaDto>>> GetMedia()
        {
            var media = await _mediaService.GetAllMedias();

            if (media != null)
                return media;

            return media;
        }
    }
}
