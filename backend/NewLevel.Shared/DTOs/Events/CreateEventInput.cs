using Microsoft.AspNetCore.Http;
using NewLevel.Domain.Enums.Band;

namespace NewLevel.Shared.DTOs.Events
{
    public class CreateEventInput
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public string Location { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public string? TicketLink { get; set; }
        public List<EMusicGenres> Genres { get; set; }
        public IFormFile? Banner { get; set; }
        public int? BannerPosition { get; set; }
        public List<IFormFile>? Photos { get; set; }
    }
}
