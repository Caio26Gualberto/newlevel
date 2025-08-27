namespace NewLevel.Shared.DTOs.Auth
{
    public class LoginResponseDto
    {
        public TokensDto? Tokens { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
