using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;

namespace NewLevel.Application.Utils.UserUtils
{
    public static class UserUtils
    {
        public static async Task<User> GetCurrentUserAsync(IServiceProvider provider)
        {
            var httpContextAccessor = provider.GetRequiredService<IHttpContextAccessor>();
            var userRepo = provider.GetRequiredService<IRepository<User>>();

            var userId = httpContextAccessor.HttpContext?.Items["userId"];
            if (userId == null)
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");

            var user = await userRepo.FirstOrDefaultAsync(x => x.Id == Convert.ToInt32(userId));
            if (user == null)
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");

            return user;
        }
    }
}
