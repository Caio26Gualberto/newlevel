using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Context;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Authenticate;
using NewLevel.Interfaces.Services.Band;
using NewLevel.Interfaces.Services.Comment;
using NewLevel.Interfaces.Services.Common;
using NewLevel.Interfaces.Services.Email;
using NewLevel.Interfaces.Services.Github;
using NewLevel.Interfaces.Services.Media;
using NewLevel.Interfaces.Services.Photo;
using NewLevel.Interfaces.Services.SystemNotification;
using NewLevel.Interfaces.Services.User;
using NewLevel.Services.AmazonS3;
using NewLevel.Services.Authenticate;
using NewLevel.Services.Band;
using NewLevel.Services.Comment;
using NewLevel.Services.Common;
using NewLevel.Services.Github;
using NewLevel.Services.Media;
using NewLevel.Services.Photo;
using NewLevel.Services.SystemNotificationService;
using NewLevel.Services.UserService;
using System.Text;

namespace NewLevel
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<NewLevelDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("MainDb"), p => p.MigrationsAssembly(typeof(NewLevelDbContext).Assembly.FullName)));

            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromMinutes(30);
            });
            services.AddIdentity<User, IdentityRole>(options =>
            {
                // Configure a política de senha aqui
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
            })
            .AddEntityFrameworkStores<NewLevelDbContext>()
            .AddDefaultTokenProviders()
            .AddTokenProvider<DataProtectorTokenProvider<User>>("local");

            var key = Encoding.ASCII.GetBytes(configuration["jwtkey"]!);
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
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<IGithubService, GithubService>();
            services.AddScoped<ISystemNotificationService, SystemNotificationService>();
            services.AddScoped<IBandService, BandService>();

            return services;
        }
    }
}
