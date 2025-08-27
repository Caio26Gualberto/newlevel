using NewLevel.Domain.Enums.Band;
using NewLevel.Domain.Enums.Event;
using NewLevel.Shared.DTOs.Photos;
using NewLevel.Shared.DTOs.User;

namespace NewLevel.Shared.DTOs.Events
{
    public class EventResponseDto
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public string? Location { get; set; }
        public string? BannerUrl { get; set; }
        public int? BannerPosition { get; set; }
        public int? OrganizerId { get; set; }
        public string? OrganizerName { get; set; }
        public List<EMusicGenres>? Genre { get; set; }
        public string? TicketsLink { get; set; }
        public decimal? Price { get; set; }
        public int? Capacity { get; set; }
        public EEventStatus? EventStatus { get; set; }
        public List<BandDto>? Bands { get; set; }
        public List<PhotoResponseDto>? Photos { get; set; }
        public int? CommentsCount { get; set; }
    }
}
