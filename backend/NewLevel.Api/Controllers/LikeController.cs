using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.Likes;
using NewLevel.Shared.DTOs.Likes;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LikeController : ControllerBase
    {
        private readonly ILikeService _likeService;
        public LikeController(ILikeService likeService)
        {
            _likeService = likeService;
        }

        [HttpPost("toggle")]
        public async Task<ActionResult<NewLevelResponse<bool>>> ToggleLike(LikeInput input)
        {
            try
            {
                var result = await _likeService.Like(input);
                return Ok(new NewLevelResponse<bool> { IsSuccess = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool> { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
