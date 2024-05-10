namespace NewLevel.Dtos.Authenticate
{
    public class TokensDto
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public bool? SkipIntroduction { get; set; }
    }
}
