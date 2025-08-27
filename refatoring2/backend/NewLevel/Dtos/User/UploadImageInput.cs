namespace NewLevel.Dtos.User
{
    public class UploadImageInput
    {
        public IFormFile File { get; set; }
        public int? Position { get; set; }
    }
}
