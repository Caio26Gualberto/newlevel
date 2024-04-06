using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Domain.Account;
using NewLevel.Infra.Data.Context;
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

        public async Task<(string, string)> Authenticate(string email, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(email, password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _signInManager.UserManager.FindByEmailAsync(email);
                var tokenString = GenerateJwtToken(user);
                var refreshToken = string.Empty;

                if (!user.RefreshToken.Any())
                {
                    refreshToken = GenerateRefreshToken();
                    user.Update(refreshToken);
                    _newLevelDbContext.Users.Update(user);
                    await _newLevelDbContext.SaveChangesAsync();
                }

                return (tokenString, refreshToken);
            }

            return (string.Empty, string.Empty);
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

        private string GenerateJwtToken(IdentityUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("e9314d36ab7170d3d8a0c40971c96987915e27a4648c20e04184348d7c637c55d0f136de5e85a7c9f1cc314ebdebb17784e93c79a462dbf96bd711e6f7b7b94f");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("userId", user.Id)
                }),
                Expires = DateTime.UtcNow.AddMinutes(2),
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
    }
}
