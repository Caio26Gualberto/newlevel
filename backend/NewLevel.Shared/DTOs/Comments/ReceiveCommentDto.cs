namespace NewLevel.Shared.DTOs.Comments
{
    public class ReceiveCommentDto
    {
        public string Text { get; set; }
        public int? MediaId { get; set; }
        public int? PhotoId { get; set; }
        public int? EventId { get; set; }
        public int? PostId { get; set; }
    }
}
