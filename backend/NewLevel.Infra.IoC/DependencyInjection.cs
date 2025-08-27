using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Application.Interfaces;
using NewLevel.Application.Interfaces.Bands;
using NewLevel.Application.Interfaces.Cache;
using NewLevel.Application.Interfaces.Comments;
using NewLevel.Application.Interfaces.Commons;
using NewLevel.Application.Interfaces.Events;
using NewLevel.Application.Interfaces.Github;
using NewLevel.Application.Interfaces.Medias;
using NewLevel.Application.Interfaces.Photos;
using NewLevel.Application.Interfaces.SystemNotification;
using NewLevel.Application.Interfaces.User;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Services.Auth;
using NewLevel.Application.Services.Bands;
using NewLevel.Application.Services.Cache;
using NewLevel.Application.Services.Comments;
using NewLevel.Application.Services.Commons;
using NewLevel.Application.Services.DomainUser;
using NewLevel.Application.Services.Email;
using NewLevel.Application.Services.Events;
using NewLevel.Application.Services.Github;
using NewLevel.Application.Services.Medias;
using NewLevel.Application.Services.Photos;
using NewLevel.Application.Services.Seeding;
using NewLevel.Application.Services.SystemNotifications;
using NewLevel.Domain.Interfaces.Authenticate;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Domain.Interfaces.Seeding;
using NewLevel.Infra.Data.Context;
using NewLevel.Infra.Data.Identity;
using NewLevel.Infra.Data.Identity.AuthenticateService;
using NewLevel.Infra.Data.Identity.Seeding;
using NewLevel.Infra.Data.Repositories;
using System.Text;

namespace NewLevel.Infra.IoC
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfraIoC(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<NewLevelDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Identity Configuration
            services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<NewLevelDbContext>()
            .AddDefaultTokenProviders();

            // JWT Configuration
            var jwtSettings = configuration.GetSection("JWT");
            var secretKey = jwtSettings["SecretKey"] ?? "your-secret-key-here-make-it-long-enough";

            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("Redis");
                options.InstanceName = "NewLevel_";
            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            // Dependency Injection
            services.AddScoped<IAuthenticateService, AuthenticateService>();
            services.AddScoped<AuthAppService>();
            services.AddScoped<AmazonS3Service>();
            services.AddScoped<SeedWorker>();
            services.AddScoped<AuthenticateService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IGithubService, GithubService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<ISystemNotificationService, SystemNotificationService>();
            services.AddScoped<IBandService, BandService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<ICommonService, CommonService>();
            services.AddScoped<IMediaService, MediaService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<ISeedService, SeedService>();
            services.AddScoped<ICacheService, CacheService>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            // CORS Configuration
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
            return services;
        }
    }
}
