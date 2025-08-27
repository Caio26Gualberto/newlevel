using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.Commons;
using NewLevel.Application.Interfaces.Github;
using NewLevel.Domain.Enums.Band;
using NewLevel.Domain.Enums.User;
using NewLevel.Shared.DTOs.Commons;
using NewLevel.Shared.DTOs.Github;
using NewLevel.Shared.Enums.Github;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        private readonly ICommonService _commonService;
        private readonly IGithubService _githubService;
        public CommonController(ICommonService commonService, IGithubService githubService)
        {
            _commonService = commonService;
            _githubService = githubService;
        }

        [HttpGet("GetDisplayCities")]
        public ActionResult<NewLevelResponse<List<SelectOptionDto>>> GetDisplayCities()
        {
            var displayList = _commonService.GetDisplayOptions<EActivityLocation>();
            if (displayList == null)
            {
                return NotFound();
            }

            return Ok(new NewLevelResponse<List<SelectOptionDto>> { IsSuccess = true, Data = displayList });
        }

        [HttpGet("GetDisplayGitLabels")]
        public ActionResult<NewLevelResponse<List<SelectOptionDto>>> GetDisplayGitLabels()
        {
            var displayList = _commonService.GetDisplayOptions<EGitLabels>();
            if (displayList == null)
            {
                return NotFound();
            }

            return Ok(new NewLevelResponse<List<SelectOptionDto>> { IsSuccess = true, Data = displayList });
        }

        [HttpGet("GetDisplayMusicGenres")]
        public ActionResult<NewLevelResponse<List<SelectOptionDto>>> GetDisplayMusicGenres()
        {
            var displayList = _commonService.GetDisplayOptions<EMusicGenres>();
            if (displayList == null)
            {
                return NotFound();
            }

            return Ok(new NewLevelResponse<List<SelectOptionDto>> { IsSuccess = true, Data = displayList });
        }

        [HttpPost("CreateIssue")]
        public async Task<ActionResult<NewLevelResponse<string>>> CreateIssue(CreateGitIssueInput input)
        {
            var issueUrl = await _githubService.CreateIssue(input);
            if (string.IsNullOrEmpty(issueUrl))
            {
                return NotFound();
            }

            return Ok(new NewLevelResponse<string> { IsSuccess = true, Message = "Relatório criado com sucesso", Data = issueUrl });
        }
    }
}
