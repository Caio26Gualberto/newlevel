using NewLevel.Enums;
using NewLevel.Enums.Event;

namespace NewLevel.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public string Location { get; set; }
        public string? bannerUrl { get; set; }
        public int OrganizerId { get; set; }
        public List<EMusicGenres> Genre { get; set; }
        public string? TicketsLink { get; set; }
        public decimal? Price { get; set; }
        public int? Capacity { get; set; }
        public EEventStatus EventStatus { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
