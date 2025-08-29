using NewLevel.Shared.DTOs.Events;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Interfaces.Events
{
    public interface IEventService
    {
        public Task<EventResponseDto> GetEvent(int id);
        public Task<bool> CreateEvent(CreateEventInput input);
        public Task<bool> UpdateEvent(UpdateEventInput input);
        public Task<bool> DeleteEvent(int id);
        public Task<GenericList<EventResponseDto>> GetAllEvents(Pagination input);
    }
}
