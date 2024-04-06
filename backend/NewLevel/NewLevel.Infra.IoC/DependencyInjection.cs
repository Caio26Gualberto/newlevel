using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Domain.Account;
using NewLevel.Infra.Data.Context;
using NewLevel.Infra.Data.Identity;
using System.Text;

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

            var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("SecretKey")!);
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false; // Este valor deve ser verdadeiro em produção
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddScoped<IAuthenticate, AuthenticateService>();

            services.ConfigureApplicationCookie(options => options.AccessDeniedPath = "/Account/Login");

            return services;
        }
    }
}
