namespace NewLevel.Dtos.Authenticate
{
    public class LoginResponseDto
    {
        public TokensDto? Tokens { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
