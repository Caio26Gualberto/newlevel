using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Photo;
using NewLevel.Interfaces.Services.Photo;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : Controller
    {
        private readonly IPhotoService _photoService;
        public PhotoController(IPhotoService photoService)
        {
            _photoService = photoService;
        }

        [HttpPost("UploadPhoto")]
        public async Task<ActionResult<NewLevelResponse<bool>>> UploadPhoto([FromForm] PhotoArchiveInput file)
        {
            try
            {
                var result = await _photoService.UploadPhoto(file);
                if (!result)
                {
                    return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = result, Message = "Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor" });
                }
                return StatusCode(200, new NewLevelResponse<bool> { IsSuccess = result, Message = "imagem adicionada à nuvem com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(200, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
