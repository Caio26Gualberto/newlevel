using Microsoft.AspNetCore.Identity;
using NewLevel.Entities;

namespace NewLevel.Utils
{
    public class Utils
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        public Utils(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public async Task<User> GetUserAsync()
        {
            var userId = _httpContextAccessor.HttpContext!.Items["userId"];

            if (userId == null)
            {
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
            }
            var user = await _userManager.FindByIdAsync(userId.ToString()!);

            if (user == null)
            {
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
            }

            return user;
        }
    }
}
