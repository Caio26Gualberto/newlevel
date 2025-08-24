using Microsoft.AspNetCore.Identity;

namespace NewLevel.Context
{
    public class Role : IdentityRole<int>
    {
        public Role() : base() { }
        public Role(string role) : base(role)
        {
            
        }
    }
}
