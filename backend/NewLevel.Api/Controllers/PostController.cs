﻿using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.Posts;
using NewLevel.Shared.DTOs.Posts;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpPost]
        [RequestSizeLimit(1073741824)]
        public async Task<ActionResult<NewLevelResponse<bool>>> CreatePost(CreatePostInput input)
        {
            try
            {
                var result = await _postService.CreatePostAsync(input);
                return Ok(new NewLevelResponse<bool>
                {
                    IsSuccess = result,
                    Message = result ? "Post criado com sucesso" : "Erro ao criar post",
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool>
                {
                    IsSuccess = false,
                    Message = ex.Message,
                    Data = false
                });
            }
        }

        [HttpGet]
        public async Task<ActionResult<NewLevelResponse<GenericList<PostDto>>>> GetAll(Pagination input)
        {
            try
            {
                var result = await _postService.GetAll(input);
                return Ok(new NewLevelResponse<GenericList<PostDto>>
                {
                    IsSuccess = true,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<GenericList<PostDto>>
                {
                    IsSuccess = false,
                    Message = ex.Message
                });
            }
        }
    }
}
