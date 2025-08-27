using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.Comments;
using NewLevel.Shared.DTOs.Comments;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("GetCommentsByPhotoId")]
        public async Task<ActionResult<NewLevelResponse<CommentsPhotoResponseDto>>> GetCommentsByPhotoId(Pagination pagination, int photoId)
        {
            try
            {
                var result = await _commentService.GetCommentsByPhotoId(pagination, photoId);

                if (result.Comments.Count >= 0)
                {
                    return Ok(new NewLevelResponse<CommentsPhotoResponseDto> { IsSuccess = true, Data = result });
                }

                return StatusCode(500, new NewLevelResponse<CommentsPhotoResponseDto> { IsSuccess = false });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<CommentsPhotoResponseDto> { Message = ex.Message, IsSuccess = false });
            }
        }

        [HttpGet("GetCommentsByMediaId")]
        public async Task<ActionResult<NewLevelResponse<CommentsPhotoResponseDto>>> GetCommentsByMediaId(Pagination pagination, int mediaId)
        {
            try
            {
                var result = await _commentService.GetCommentsByMediaId(pagination, mediaId);

                if (result.Comments.Count >= 0)
                {
                    return Ok(new NewLevelResponse<CommentsPhotoResponseDto> { IsSuccess = true, Data = result });
                }

                return StatusCode(500, new NewLevelResponse<CommentsPhotoResponseDto> { IsSuccess = false });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<CommentsPhotoResponseDto> { Message = ex.Message, IsSuccess = false });
            }
        }

        [HttpPost("SaveComment")]
        public async Task<ActionResult<NewLevelResponse<bool>>> SaveComment(ReceiveCommentDto input)
        {
            try
            {
                var result = await _commentService.SaveComment(input);

                if (result)
                {
                    return Ok(new NewLevelResponse<bool> { IsSuccess = true });
                }

                return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = "Algo deu errado ao comentar na publicação" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> { Message = ex.Message, IsSuccess = false });
            }
        }
    }
}
