namespace NewLevel.Shared.DTOs.Auth
{
    public class RegisterResponseDto
    {
        public bool Result { get; set; }
        public string Message { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int? BandId { get; set; }
    }
}
