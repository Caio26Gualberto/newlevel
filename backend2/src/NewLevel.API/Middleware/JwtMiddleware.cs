using Microsoft.AspNetCore.Identity;
using NewLevel.Application.Services;
using NewLevel.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace NewLevel.API.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public JwtMiddleware(RequestDelegate next, IServiceScopeFactory serviceScopeFactory)
    {
        _next = next;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null)
        {
            await AttachUserToContext(context, token);
        }

        await _next(context);
    }

    private async Task AttachUserToContext(HttpContext context, string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            // Check if token is about to expire (within 5 minutes)
            var expiryTime = jwtToken.ValidTo;
            if (expiryTime <= DateTime.UtcNow.AddMinutes(5))
            {
                // Token is about to expire, check if we can refresh it
                using var scope = _serviceScopeFactory.CreateScope();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
                var authService = scope.ServiceProvider.GetRequiredService<IAuthService>();

                var userId = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
                if (userId != null)
                {
                    var user = await userManager.FindByIdAsync(userId);
                    if (user?.RefreshToken != null && user.RefreshTokenExpiryTime > DateTime.UtcNow)
                    {
                        // Add header to indicate token should be refreshed
                        context.Response.Headers.Add("X-Token-Refresh-Required", "true");
                    }
                }
            }
        }
        catch
        {
            // Token validation failed, continue without attaching user
        }
    }
}
