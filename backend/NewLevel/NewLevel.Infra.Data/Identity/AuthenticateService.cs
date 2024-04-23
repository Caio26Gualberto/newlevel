using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Infra.Data.Context;
using NewLevel.Shared.Dtos;
using NewLevel.Shared.Interfaces.Account;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace NewLevel.Infra.Data.Identity
{
    public class AuthenticateService : IAuthenticate
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly NewLevelDbContext _newLevelDbContext;

        public AuthenticateService(UserManager<User> userManager, SignInManager<User> signInManager, NewLevelDbContext newLevelDbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _newLevelDbContext = newLevelDbContext;
        }

        public async Task<TokensDto> Authenticate(string email, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(email, password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _signInManager.UserManager.FindByEmailAsync(email);
                var tokenString = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();
                DateTime expirationDate = DateTime.UtcNow.AddHours(-3).AddMinutes(5);

                user.Update(refreshToken,expirationDate);
                _newLevelDbContext.Users.Update(user);
                await _newLevelDbContext.SaveChangesAsync();

                return new TokensDto {Token = tokenString, RefreshToken = refreshToken };
            }

            return new TokensDto();
        }

        public async Task<bool> RegisterUser(string email, string password)
        {
            User user = new User
            {
                UserName = email,
                Email = email
            };

            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
                await _signInManager.SignInAsync(user, isPersistent: false);

            return result.Succeeded;
        }

        public async Task Logout()
        {
            await _signInManager.SignOutAsync();
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

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public async Task<TokensDto> RenewToken(string expiredToken)
        {
            if (string.IsNullOrEmpty(expiredToken))
            {
                throw new ArgumentNullException(nameof(expiredToken), "O token expirado não pode ser nulo ou vazio.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.ReadToken(expiredToken) as JwtSecurityToken;

            if (token == null)
            {
                throw new ArgumentException("O token expirado é inválido.");
            }

            var userIdClaim = token.Claims.FirstOrDefault(c => c.Type == "userId");
            if (userIdClaim == null)
            {
                throw new ArgumentException("O token expirado não contém a reivindicação 'userId'.");
            }

            var userId = userIdClaim.Value;
            var user = await _newLevelDbContext.Users.FirstOrDefaultAsync(x => x.Id == userId);

            if (user != null)
            {
                if (user.TokenExpiresIn < DateTime.UtcNow.AddHours(-3))
                {
                    return new TokensDto();
                }

                var accessToken = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();
                DateTime expirationDate = DateTime.UtcNow.AddHours(-3).AddMinutes(5);


                user.Update(refreshToken, expirationDate);
                _newLevelDbContext.Users.Update(user);
                await _newLevelDbContext.SaveChangesAsync();

                return new TokensDto 
                {
                    Token = accessToken,
                    RefreshToken = refreshToken
                };
            }

            return new TokensDto();
        }
    }
}
