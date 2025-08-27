using Microsoft.AspNetCore.Identity;
using NewLevel.Domain.Entities;

namespace NewLevel.Infra.Data.Identity
{
    public class ApplicationUser : IdentityUser<int>
    {
        public int DomainUserId { get; set; }
        public User User { get; set; } = null!;
    }
}
