using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Authenticate;
using NewLevel.Dtos.Common;
using NewLevel.Dtos.Utils;
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
        public async Task<ActionResult<NewLevelResponse<List<DisplayActivityLocationDto>>>> GetDisplayCities()
        {
            var displayList = _commonService.GetDisplayActivityLocation();
            if (displayList == null)
            {
                return NotFound();
            }

            return Ok(new NewLevelResponse<List<DisplayActivityLocationDto>> { IsSuccess = true, Data = displayList});
        }

        [HttpGet("GetDisplayGitLabels")]
        public async Task<ActionResult<NewLevelResponse<List<SelectOptionDto>>>> GetDisplayGitLabels()
        {
            var displayList = _commonService.GetDisplayGitLabels();
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
