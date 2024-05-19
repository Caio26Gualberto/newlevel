namespace NewLevel.Dtos.Photo
{
    public class PhotoResponseDto
    {
        public string UserId { get; set; }
        public string Src { get; set; }
        public string? AvatarSrc { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public DateTime CaptureDate { get; set; }
        public string Nickname { get; set; }
        public string Description { get; set; }
    }
}
