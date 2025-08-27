using System.IdentityModel.Tokens.Jwt;

namespace NewLevel.Services.Jwt
{
    public static class JwtService
    {
        public static string RetrieveUserIdFromJwt(string accessToken)
        {
            if (!string.IsNullOrEmpty(accessToken) && accessToken != "undefined")
            {
                var jwtTokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = jwtTokenHandler.ReadToken(accessToken) as JwtSecurityToken;

                var userId = jwtToken?.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    return userId;
                }
            }

            return string.Empty;
        }
    }
}
