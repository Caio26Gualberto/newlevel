using NewLevel.Shared.Service;
using System.IdentityModel.Tokens.Jwt;

namespace NewLevel.Api.Middleware
{
    public class JWTMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly UserIdInterceptor _interceptor;

        public JWTMiddleware(RequestDelegate next, UserIdInterceptor userContext)
        {
            _next = next;
            _interceptor = userContext;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                string token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);

                if (jwtToken.Payload.TryGetValue("userId", out object userId))
                {
                    _interceptor.UserId = userId.ToString();
                }
            }

            await _next(context);
        }
    }
}
