using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NewLevel.Context;
using NewLevel.Dtos.Authenticate;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Authenticate;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NewLevel.Services.Authenticate
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
            var userId = _httpContextAccessor.HttpContext.Items["userId"].ToString();
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

        public async Task<LoginResponseDto> Login(string email, string password)
        {
            var result = await _signInManager.PasswordSignInAsync(email, password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _signInManager.UserManager.FindByEmailAsync(email);
                var tokenString = GenerateJwtToken(user);

                user.Update(isFirstTimeLogin: null, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatar: null);
                var refreshToken = await _userManager.GenerateUserTokenAsync(user, tokenProvider: "local", purpose: "email");
                await _userManager.SetAuthenticationTokenAsync(user, loginProvider: "email", tokenName: "refresh_token", tokenValue: refreshToken);

                return new LoginResponseDto
                {
                    IsSuccess = result.Succeeded,
                    Message = $"Bem vindo {user.Nickname}!",
                    Tokens = new TokensDto { Token = tokenString, RefreshToken = refreshToken, SkipIntroduction = !user.IsFirstTimeLogin }
                };
            }

            return new LoginResponseDto { IsSuccess = result.Succeeded, Message = "Usuário ou senha inválidos" };
        }

        public async Task<RegisterResponseDto> Register(RegisterInputDto input)
        {
            Dictionary<string, string> errors = new Dictionary<string, string>()
            {
                { "PasswordTooShort", "Senha muito curta" },
                { "PasswordRequiresNonAlphanumeric", "Senha requer caractere não alfanumérico" },
                { "PasswordRequiresDigit", "Senha requer números" },
                { "PasswordRequiresLower", "Senha requer letra minúscula" },
                { "PasswordRequiresUpper", "Senha requer letra maiúscula" }
            };

            var user = new User(isFirstTimeLogin: true, nickName: input.Nickname, activityLocation: input.ActivityLocation, avatar: null);
            user.UserName = input.Email;
            user.Email = input.Email;

            var result = await _userManager.CreateAsync(user, input.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return new RegisterResponseDto { Result = true, Message = "Bem vindo!" };
            }
            else if (result.Errors.Any(e => errors.ContainsKey(e.Code)) && result.Errors.Count() == 1)
            {
                var errorMessage = result.Errors.First();
                return new RegisterResponseDto { Result = false, Message = errors[errorMessage.Code] };
            }
            else if (result.Errors.Any(e => errors.ContainsKey(e.Code)) && result.Errors.Count() > 1)
            {
                var errorMessages = result.Errors.Where(e => errors.ContainsKey(e.Code)).Select(e => errors[e.Code]);
                var error = string.Join("\n - ", errorMessages);
                return new RegisterResponseDto { Result = false, Message = error };
            }

            return new RegisterResponseDto { Result = false, Message = "Erro ao registrar usuário" };
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
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
