using NewLevel.Enums.Authenticate;

namespace NewLevel.Dtos.User
{
    public class UpdateUserInput
    {
        public string? Email { get; set; }
        public string? Nickname { get; set; }
        public EActivityLocation? ActivityLocation { get; set; }
        public IFormFile? File { get; set; }
    }
}
