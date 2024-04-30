using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Context;
using NewLevel.Dtos;
using NewLevel.Entities;
using NewLevel.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace NewLevel.Services
{
    public class AuthenticateService : IAuthenticateService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly NewLevelDbContext _newLevelDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthenticateService(UserManager<User> userManager, SignInManager<User> signInManager, NewLevelDbContext newLevelDbContext, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _newLevelDbContext = newLevelDbContext;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<TokensDto> GenerateNewAccessToken(string accessToken)
        {
            var userId = _httpContextAccessor.HttpContext.Items["userId"] as string;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return new TokensDto();
            }

            var refreshToken = await _userManager.GetAuthenticationTokenAsync(user, loginProvider: "email", tokenName: "refresh_token");
            var result = await _userManager.VerifyUserTokenAsync(user, tokenProvider: "local", purpose: "email", refreshToken);

            if (result)
            {
                var token = GenerateJwtToken(user);
                var newRefreshToken = await _userManager.GenerateUserTokenAsync(user, tokenProvider: "local", purpose: "email");

                if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(newRefreshToken))
                    return new TokensDto { Token = token, RefreshToken = newRefreshToken };
            }

            return new TokensDto();
        }

        public async Task<TokensDto> Login(string email, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(email, password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _signInManager.UserManager.FindByEmailAsync(email);
                var tokenString = GenerateJwtToken(user);

                user.Update(isFirstTimeLogin: null);
                var refreshToken = await _userManager.GenerateUserTokenAsync(user, tokenProvider: "local", purpose: "email");
                await _userManager.SetAuthenticationTokenAsync(user, loginProvider: "email", tokenName: "refresh_token", tokenValue: refreshToken);

                return new TokensDto { Token = tokenString, RefreshToken = refreshToken };
            }

            return new TokensDto();
        }

        public async Task<bool> Register(string email, string password)
        {
            var user = new User {UserName = email, Email = email };
            var result = await  _userManager.CreateAsync(user, password);

            if (result.Succeeded)
                await _signInManager.SignInAsync(user, isPersistent: false);
            
            return result.Succeeded;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("jwtkey")!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("userId", user.Id)
                }),
                Expires = DateTime.UtcNow.AddSeconds(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
