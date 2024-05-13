using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.ApiResponse;
using NewLevel.Dtos.Authenticate;
using NewLevel.Dtos.Utils;
using NewLevel.Interfaces.Services.Common;

namespace NewLevel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : Controller
    {
        private readonly ICommonService _commonService;
        public CommonController(ICommonService commonService)
        {
            _commonService = commonService;
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
    }
}
