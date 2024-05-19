using Microsoft.AspNetCore.Identity;
using NewLevel.Entities;

namespace NewLevel.Services.Admin
{
    public static class DataSeeder
    {
        public static async Task SeedAdminUser(IServiceProvider serviceProvider, string adminEmail, string adminPassword)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            // Verificar se a role "Admin" existe, e criar se não existir
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            // Verificar se o usuário admin existe
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                // Criar o usuário admin se não existir
                adminUser = new User { UserName = adminEmail, Email = adminEmail };
                var result = await userManager.CreateAsync(adminUser, adminPassword);

                if (result.Succeeded)
                {
                    // Adicionar o usuário à role "Admin"
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
            else
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
}
