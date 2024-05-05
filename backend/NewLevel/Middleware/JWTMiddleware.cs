using NewLevel.Services.Jwt;
using System.IdentityModel.Tokens.Jwt;

namespace NewLevel.Api.Middleware
{
    public class JWTMiddleware
    {
        private readonly RequestDelegate _next;

        public JWTMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        
        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                string token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var userId = JwtService.RetrieveUserIdFromJwt(token);
                context.Items["UserId"] = userId;
            }
            else if (context.Request.QueryString.Value.Contains("accessToken"))
            {
                var queryStringSplited = context.Request.QueryString.Value.Split("=");
                var expiredAccessToken = queryStringSplited[1];
                var userId = JwtService.RetrieveUserIdFromJwt(expiredAccessToken);
                context.Items["userId"] = userId;
            }

            await _next(context);
        } 
    }
}