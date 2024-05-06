using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos;
using NewLevel.Interfaces.Services;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : Controller
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
                return new NewLevelResponse<List<MediaDto>> { Data = media, IsSuccess = true };

            return new NewLevelResponse<List<MediaDto>> { Data = media, IsSuccess = false, Message = "Não foi possível carregar os vídeos, se o problema persistir entre em contato com o desenvolvedor" };
        }

        [HttpPost("RequestMedia")]
        public async Task<NewLevelResponse<bool>> RequestMedia(RequestMediaDto input)
        {
            var result = await _mediaService.RequestMedia(input);

            if (!result)
            {
                return new NewLevelResponse<bool> { IsSuccess = false, Message = "Não foi possível processar a música, se o problema persistir entre em contato com o desenvolvedor" };
            }

            return new NewLevelResponse<bool> { Message = "Música solicitada com sucesso", IsSuccess = true };
        }
    }
}
