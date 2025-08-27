using Microsoft.AspNetCore.Http;
using NewLevel.Domain.Enums.User;

namespace NewLevel.Shared.DTOs.User
{
    public class UpdateUserInput
    {
        public string? Email { get; set; }
        public string? Nickname { get; set; }
        public EActivityLocation? ActivityLocation { get; set; }
        public IFormFile? File { get; set; }
    }
}
