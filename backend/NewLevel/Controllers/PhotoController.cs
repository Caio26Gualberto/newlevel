﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Photo;
using NewLevel.Dtos.Utils;
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
                return StatusCode(200, new NewLevelResponse<bool> { IsSuccess = result, Message = "imagem adicionada à nuvem com sucesso, agora é só aguardar a aprovação" });
            }
            catch (Exception ex)
            {
                return StatusCode(200, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("GetAllPhotos")]
        public async Task<ActionResult<NewLevelResponse<GenericList<PhotoResponseDto>>>> GetAllPhotos(Pagination input)
        {
            try
            {
                var result = await _photoService.GetAllPhotos(input, false);
                if (result == null)
                {
                    return StatusCode(500, new NewLevelResponse<GenericList<PhotoResponseDto>> { IsSuccess = false, Message = "Erro ao carregar imagens" });
                }

                return StatusCode(200, new NewLevelResponse<GenericList<PhotoResponseDto>> { IsSuccess = true, Data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(200, new NewLevelResponse<GenericList<PhotoResponseDto>> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("GetPhotoToApprove")]
        public async Task<ActionResult<NewLevelResponse<GenericList<PhotoResponseDto>>>> GetPhotoToApprove(Pagination input)
        {
            try
            {
                var result = await _photoService.GetAllPhotos(input, true);
                if (result == null)
                {
                    return StatusCode(500, new NewLevelResponse<GenericList<PhotoResponseDto>> { IsSuccess = false, Message = "Erro ao carregar imagens" });
                }

                return StatusCode(200, new NewLevelResponse<GenericList<PhotoResponseDto>> { IsSuccess = true, Data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(200, new NewLevelResponse<GenericList<PhotoResponseDto>> { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpGet("ApprovePhoto")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ApprovePhoto([FromQuery] int photoId, bool isApprove)
        {
            try
            {
                var result = await _photoService.ApprovePhoto(photoId, isApprove);
                return Ok(new NewLevelResponse<bool> { Data = result, IsSuccess = true, Message = "Foto aprovada" });
            }
            catch (Exception ex)
            {
                return StatusCode(400, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
