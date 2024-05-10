using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Context;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Authenticate;
using NewLevel.Interfaces.Services.Common;
using NewLevel.Interfaces.Services.Media;
using NewLevel.Interfaces.Services.User;
using NewLevel.Services.Authenticate;
using NewLevel.Services.Common;
using NewLevel.Services.Media;
using NewLevel.Services.UserService;
using System.Text;

namespace NewLevel
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<NewLevelDbContext>(options =>
            options.UseSqlServer(Environment.GetEnvironmentVariable("MainDb"), p => p.MigrationsAssembly(typeof(NewLevelDbContext).Assembly.FullName)));

            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromMinutes(2);
            });
            services.AddIdentity<User, IdentityRole>()
                    .AddEntityFrameworkStores<NewLevelDbContext>()
                    .AddDefaultTokenProviders()
                    .AddTokenProvider<DataProtectorTokenProvider<User>>("local");

            var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("jwtkey")!);
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
                    ClockSkew = TimeSpan.Zero,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddHttpContextAccessor();
            services.AddScoped<IAuthenticateService, AuthenticateService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICommonService, CommonService>();
            services.AddScoped<IMediaService, MediaService>();

            return services;
        }
    }
}
