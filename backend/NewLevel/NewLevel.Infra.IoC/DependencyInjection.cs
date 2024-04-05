using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NewLevel.Infra.Data.Context;
using NewLevel.Infra.Data.Identity;

namespace NewLevel.Infra.IoC
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<NewLevelDbContext>(options =>
            options.UseSqlServer(Environment.GetEnvironmentVariable("MainDb"), p => p.MigrationsAssembly(typeof(NewLevelDbContext).Assembly.FullName)));

            services.AddIdentity<User, IdentityRole>()
                    .AddEntityFrameworkStores<NewLevelDbContext>()
                    .AddDefaultTokenProviders();

            services.ConfigureApplicationCookie(options => options.AccessDeniedPath = "/Account/Login");

            return services;
        }
    }
}
