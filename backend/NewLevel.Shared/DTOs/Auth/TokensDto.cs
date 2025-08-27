namespace NewLevel.Shared.DTOs.Auth
{
    public class TokensDto
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public bool? SkipIntroduction { get; set; }
    }
}
