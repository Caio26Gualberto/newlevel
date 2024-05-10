using Microsoft.AspNetCore.Identity;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.User;

namespace NewLevel.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        public UserService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }
        public async Task<bool> Delete()
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext.Items["userId"];
                if (userId == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                var result = await _userManager.DeleteAsync(user);

                return result.Succeeded;    
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public async Task SkipIntroduction()
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext.Items["userId"];
                if (userId == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                user.Update(isFirstTimeLogin: false, nickName: user.Nickname, activityLocation: user.ActivityLocation);
                await _userManager.UpdateAsync(user);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            
        }
    }
}
