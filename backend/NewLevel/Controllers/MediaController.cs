using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Medias;
using NewLevel.Dtos.Utils;
using NewLevel.Interfaces.Services.Media;

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

        [HttpPost("GetMedia")]
        public async Task<NewLevelResponse<GenericList<MediaDto>>> GetMedia(Pagination input)
        {
            var media = await _mediaService.GetAllMedias(input);

            if (media != null)
                return new NewLevelResponse<GenericList<MediaDto>> { Data = media, IsSuccess = true };

            return new NewLevelResponse<GenericList<MediaDto>> { Data = media, IsSuccess = false, Message = "Não foi possível carregar os vídeos, se o problema persistir entre em contato com o desenvolvedor" };
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

        [HttpPost("DeleteMediaById")]
        public async Task<NewLevelResponse<bool>> DeleteMediaById([FromQuery] int id)
        {
            var result = await _mediaService.DeleteMediaById(id);

            if (result)
            {
                return new NewLevelResponse<bool> { IsSuccess = true, Message = "Vídeo deletado com sucesso!" };
            }

            return new NewLevelResponse<bool> { Message = "Algo deu errado, tente novamente", IsSuccess = false };
        }

        [HttpPost("GetMediasByUserId")]
        public async Task<NewLevelResponse<GenericList<MediaByUserIdDto>>> GetMediasByUserId(Pagination input)
        {
            var result = await _mediaService.GetMediaByUserId(input);

            if (result != null)
            {
                return new NewLevelResponse<GenericList<MediaByUserIdDto>> { IsSuccess = true, Data = result };
            }

            return new NewLevelResponse<GenericList<MediaByUserIdDto>> { Message = "Algo deu errado, tente novamente", IsSuccess = false };
        }

        [HttpPost("UpdateMediaById")]
        public async Task<NewLevelResponse<bool>> UpdateMediaById(UpdateMediaByIdInput input)
        {
            var result = await _mediaService.UpdateMediaById(input);

            if (result)
            {
                return new NewLevelResponse<bool> { IsSuccess = result, Message = "Alterações salvas!" };
            }

            return new NewLevelResponse<bool> { Message = "Algo deu errado, tente novamente", IsSuccess = false };
        }
    }
}
