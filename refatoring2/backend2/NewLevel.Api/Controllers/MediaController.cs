using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.Medias;
using NewLevel.Shared.DTOs.Medias;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly IMediaService _mediaService;
        public MediaController(IMediaService mediaService)
        {
            _mediaService = mediaService;
        }

        [HttpGet("GetMedia")]
        public async Task<ActionResult<NewLevelResponse<GenericList<MediaDto>>>> GetMedia([FromQuery] Pagination input)
        {
            try
            {
                var media = await _mediaService.GetAllMedias(input, false);

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

        [HttpDelete("DeleteMediaById")]
        public async Task<ActionResult<NewLevelResponse<bool>>> DeleteMediaById([FromQuery] int id)
        {
            try
            {
                var result = await _mediaService.DeleteMediaById(id);
                return StatusCode(200, new NewLevelResponse<bool> { IsSuccess = true, Message = "Vídeo deletado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<bool> { Message = ex.Message, IsSuccess = false });
            }
        }

        [HttpGet("GetMediasByUserId")]
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
                return StatusCode(200, new NewLevelResponse<bool> { IsSuccess = result, Message = "Alterações salvas!" });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<bool> { IsSuccess = false, Message = "Não foi possível salvar as alterações" });
            }
        }

        [HttpPost("GetMediaToApprove")]
        public async Task<ActionResult<NewLevelResponse<GenericList<MediaDto>>>> GetMediaToApprove(Pagination input)
        {
            try
            {
                var result = await _mediaService.GetAllMedias(input, true);
                return Ok(new NewLevelResponse<GenericList<MediaDto>> { Data = result, IsSuccess = true });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<GenericList<MediaDto>> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPatch("ApproveMedia")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ApproveMedia(ApproveMediaInput input)
        {
            try
            {
                var result = await _mediaService.ApproveMedia(input);
                return Ok(new NewLevelResponse<bool> { Data = result, IsSuccess = true, Message = "Vídeo aprovado" });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
