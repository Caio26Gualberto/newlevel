using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Authenticate;
using NewLevel.Dtos.Common;
using NewLevel.Dtos.Utils;
using NewLevel.Enums;
using NewLevel.Enums.Authenticate;
using NewLevel.Enums.GithubLabels;
using NewLevel.Interfaces.Services.Common;
using NewLevel.Interfaces.Services.Github;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : Controller
    {
        private readonly ICommonService _commonService;
        private readonly IGithubService _githubService;
        public CommonController(ICommonService commonService, IGithubService githubService)
        {
            _commonService = commonService;
            _githubService = githubService;
        }

        [HttpGet("GetDisplayCities")]
        public async Task<ActionResult<NewLevelResponse<List<SelectOptionDto>>>> GetDisplayCities()
        {
            var displayList = _commonService.GetDisplayOptions<EActivityLocation>();
            if (displayList == null)
            {
                return NotFound();
            }

            return Ok(new NewLevelResponse<List<SelectOptionDto>> { IsSuccess = true, Data = displayList});
        }

        [HttpGet("GetDisplayGitLabels")]
        public async Task<ActionResult<NewLevelResponse<List<SelectOptionDto>>>> GetDisplayGitLabels()
        {
            var displayList = _commonService.GetDisplayOptions<EGitLabels>();
            if (displayList == null)
            {
                return NotFound();
            }

            return Ok(new NewLevelResponse<List<SelectOptionDto>> { IsSuccess = true, Data = displayList });
        }

        [HttpGet("GetDisplayMusicGenres")]
        public async Task<ActionResult<NewLevelResponse<List<SelectOptionDto>>>> GetDisplayMusicGenres()
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
