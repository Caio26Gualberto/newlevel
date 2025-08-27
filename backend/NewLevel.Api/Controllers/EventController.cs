using Microsoft.AspNetCore.Mvc;
using NewLevel.Api.ApiResponse;
using NewLevel.Application.Interfaces.Events;
using NewLevel.Shared.DTOs.Events;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;
        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost("CreateEvent")]
        public async Task<ActionResult<NewLevelResponse<bool>>> CreateEvent(CreateEventInput input)
        {
            try
            {
                var result = await _eventService.CreateEvent(input);
                if (result)
                {
                    return Ok(new NewLevelResponse<bool>
                    {
                        IsSuccess = true,
                        Message = "Evento criado com sucesso.",
                        Data = true
                    });
                }
                else
                {
                    return BadRequest(new NewLevelResponse<bool>
                    {
                        IsSuccess = false,
                        Message = "Falha ao criar o evento.",
                        Data = false
                    });
                }
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

        [HttpGet("GetAll")]
        public async Task<ActionResult<NewLevelResponse<GenericList<EventResponseDto>>>> GetAll([FromQuery] Pagination input)
        {
            try
            {
                var result = await _eventService.GetAllEvents(input);
                return Ok(new NewLevelResponse<GenericList<EventResponseDto>>
                {
                    IsSuccess = true,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewLevelResponse<GenericList<EventResponseDto>>
                {
                    IsSuccess = false,
                    Message = ex.Message,
                    Data = null
                });
            }
        }

    }
}
