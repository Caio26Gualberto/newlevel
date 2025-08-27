using NewLevel.Domain.Enums.Band;
using NewLevel.Domain.Enums.Event;

namespace NewLevel.Domain.Entities
{
    public class Event : EntityBase
    {
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
    }
}
