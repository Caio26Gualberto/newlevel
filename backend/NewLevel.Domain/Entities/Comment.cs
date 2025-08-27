namespace NewLevel.Domain.Entities
{
    public class Comment : EntityBase
    {
        public string Text { get; set; }


        public int UserId { get; set; }
        public User User { get; set; }
        public int? MediaId { get; set; }
        public Media Media { get; set; }
        public int? PhotoId { get; set; }
        public Photo Photo { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }
    }
}
