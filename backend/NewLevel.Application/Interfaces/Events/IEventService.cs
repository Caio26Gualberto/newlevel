using NewLevel.Shared.DTOs.Events;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Interfaces.Events
{
    public interface IEventService
    {
        public Task<bool> CreateEvent(CreateEventInput input);
        public Task<GenericList<EventResponseDto>> GetAllEvents(Pagination input);
        public Task<bool> DeleteEvent(int id);
    }
}
