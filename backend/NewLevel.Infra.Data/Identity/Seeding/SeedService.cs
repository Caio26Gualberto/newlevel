using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NewLevel.Domain.Enums.User;
using NewLevel.Domain.Interfaces.Seeding;
using AuthService = NewLevel.Infra.Data.Identity.AuthenticateService.AuthenticateService;

namespace NewLevel.Infra.Data.Identity.Seeding
{
    public class SeedService : ISeedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly AuthService _authService;

        public SeedService(IServiceProvider serviceProvider, IConfiguration configuration, AuthService authService)
        {
            _serviceProvider = serviceProvider;
            _authService = authService;
            _configuration = configuration;
        }

        public async Task SeedRolesAndAdminAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            var roles = new[] { "User", "Band", "Admin" };

            // Cria roles
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }

            // Cria usuário admin
            var seedUsers = _configuration.GetSection("SeedUser")
                                      .Get<List<SeedUserDto>>();

            if (seedUsers == null || !seedUsers.Any())
                return;

            foreach (var userDto in seedUsers)
            {
                var adminUser = await userManager.FindByEmailAsync(userDto.Email);
                if (adminUser == null)
                {
                    var (result, _, _) = await _authService.RegisterUser(userDto.Email, userDto.Password, userDto.Nickname, userDto.Location);

                    if (string.IsNullOrEmpty(result))
                        throw new Exception("Failed to create admin user during seeding.");

                    adminUser = await userManager.FindByEmailAsync(userDto.Email);

                    if (adminUser != null)
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                }
                else if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }     
        }
    }

    public class SeedUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public EActivityLocation Location { get; set; } = EActivityLocation.SantoAndre;
    }
}
