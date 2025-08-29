using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.BandVerificationRequests;
using NewLevel.Shared.DTOs.BandVerificationRequests;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BandVerificationController : ControllerBase
    {
        private readonly IBandVerificationService _bandVerificationService;
        public BandVerificationController(IBandVerificationService service)
        {
            _bandVerificationService = service;
        }

        [HttpPost("CreateBandVerification")]
        public async Task<ActionResult<NewLevelResponse<bool>>> CreateBandVerificationRequest([FromBody] BandVerificationInput input)
        {
            try
            {
                var result = await _bandVerificationService.CreateRequest(input);
                return new NewLevelResponse<bool>()
                {
                    Data = result,
                    IsSuccess = result,
                    Message = "Solicitação enviada com sucesso."
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<bool>()
                {
                    IsSuccess = false,
                    Message = ex.Message
                });
            }
        }
    }
}
