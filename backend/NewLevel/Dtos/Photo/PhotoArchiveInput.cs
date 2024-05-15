namespace NewLevel.Dtos.Photo
{
    public class PhotoArchiveInput
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }
    }
}
