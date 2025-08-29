namespace NewLevel.Shared.DTOs.Events
{
    public class UpdateEventInput : CreateEventInput
    {
        public int EventId { get; set; }
        public List<int>? PhotosToDeleteId { get; set; }
    }
}
