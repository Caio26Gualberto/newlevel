using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Medias;
using NewLevel.Dtos.Utils;
using NewLevel.Entities;
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
        public async Task<ActionResult<NewLevelResponse<GenericList<MediaDto>>>> GetMedia(Pagination input)
        {
            try
            {
                var media = await _mediaService.GetAllMedias(input);

                if (media != null)
                    return Ok(new NewLevelResponse<GenericList<MediaDto>> { Data = media, IsSuccess = true });

                return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<GenericList<MediaDto>> { Data = null, IsSuccess = false, Message = ex.Message });
            }

        }

        [HttpPost("RequestMedia")]
        public async Task<ActionResult<NewLevelResponse<bool>>> RequestMedia(RequestMediaDto input)
        {
            try
            {
                var result = await _mediaService.RequestMedia(input);

                if (!result)
                {
                    return Ok(new NewLevelResponse<bool> { IsSuccess = false, Message = "Não foi possível processar a música, se o problema persistir entre em contato com o desenvolvedor" });
                }

                return StatusCode(201, new NewLevelResponse<bool> { IsSuccess = true, Message = "Música enviada com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<bool> { Message = ex.Message, IsSuccess = false });
            }

        }

        [HttpPost("DeleteMediaById")]
        public async Task<ActionResult<NewLevelResponse<bool>>> DeleteMediaById([FromQuery] int id)
        {
            try
            {
                var result = await _mediaService.DeleteMediaById(id);
                return StatusCode(204, new NewLevelResponse<bool> { IsSuccess = true, Message = "Vídeo deletado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<bool> { Message = ex.Message, IsSuccess = false });
            }
        }

        [HttpPost("GetMediasByUserId")]
        public async Task<ActionResult<NewLevelResponse<GenericList<MediaByUserIdDto>>>> GetMediasByUserId(Pagination input)
        {
            try
            {
                var result = await _mediaService.GetMediaByUserId(input);

                if (result != null)
                {
                    return Ok(new NewLevelResponse<GenericList<MediaByUserIdDto>> { IsSuccess = true, Data = result });
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<GenericList<MediaByUserIdDto>> { Message = ex.Message, IsSuccess = false });
            }
        }

        [HttpPost("UpdateMediaById")]
        public async Task<ActionResult<NewLevelResponse<bool>>> UpdateMediaById(UpdateMediaByIdInput input)
        {
            try
            {
                var result = await _mediaService.UpdateMediaById(input);
                return StatusCode(204, new NewLevelResponse<bool> { IsSuccess = result, Message = "Alterações salvas!" });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<bool> { IsSuccess = false, Message = "Não foi possível salvar as alterações" });
            }
        }
    }
}
