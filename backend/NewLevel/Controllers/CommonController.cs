using Microsoft.AspNetCore.Mvc;
using NewLevel.Dtos.Authenticate;
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
        public async Task<List<DisplayActivityLocationDto>> GetDisplayCities()
        {
            var displayList = _commonService.GetDisplayActivityLocation();
            return displayList;
        }
    }
}
