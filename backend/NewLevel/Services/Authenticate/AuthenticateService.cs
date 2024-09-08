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
        private readonly Utils.Utils _utils;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthenticateService(UserManager<User> userManager, SignInManager<User> signInManager, NewLevelDbContext newLevelDbContext, IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _newLevelDbContext = newLevelDbContext;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _utils = new Utils.Utils(httpContextAccessor, userManager);
            _roleManager = roleManager;
        }
        public async Task<TokensDto> GenerateNewAccessToken(string accessToken)
        {
            var user = await _utils.GetUserAsync();

            if (user == null)
            {
                return new TokensDto();
            }

            var refreshToken = await _userManager.GetAuthenticationTokenAsync(user, loginProvider: "email", tokenName: "refresh_token");
            var result = await _userManager.VerifyUserTokenAsync(user, tokenProvider: "local", purpose: "email", refreshToken);
            var roles = await _userManager.GetRolesAsync(user);

            if (result)
            {
                var token = GenerateJwtToken(user, roles);
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
                var roles = await _userManager.GetRolesAsync(user);
                var tokenString = GenerateJwtToken(user, roles);

                user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatarKey: user.AvatarKey,
                    publicTimer:user.PublicTimer, avatarUrl: user.AvatarUrl, email: user.Email);

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

        public async Task<bool> Logout()
        {
            var user = _utils.GetUserAsync();
            await _signInManager.SignOutAsync();
            return true;
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

            var user = new User(isFirstTimeLogin: true, nickName: input.Nickname, activityLocation: input.ActivityLocation, avatar: null, publicTimer: null,
                avatarUrl: null);

            user.UserName = input.Email;
            user.Email = input.Email;

            var result = await _userManager.CreateAsync(user, input.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return new RegisterResponseDto { Result = true, Message = "Conta criada!" };
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

        public async Task<RegisterResponseDto> BandRegister(RegisterInputDto input)
        {
            Dictionary<string, string> errors = new Dictionary<string, string>()
            {
                { "PasswordTooShort", "Senha muito curta" },
                { "PasswordRequiresNonAlphanumeric", "Senha requer caractere não alfanumérico" },
                { "PasswordRequiresDigit", "Senha requer números" },
                { "PasswordRequiresLower", "Senha requer letra minúscula" },
                { "PasswordRequiresUpper", "Senha requer letra maiúscula" }
            };

            var artist = new Artist(input.Nickname, input.Description, DateTime.UtcNow.AddHours(-3), (DateTime)input.CreatedAt, isFirstTimeLogin: true, input.Nickname, avatar: null, input.ActivityLocation,
                publicTimer: null, avatarUrl: null, input.Email);

            artist.UserName = input.Email;
            artist.Email = input.Email;

            var result = await _userManager.CreateAsync(artist, input.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(artist, isPersistent: false);
                return new RegisterResponseDto { Result = true, Message = "Conta criada!" };
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

        private string GenerateJwtToken(User user, IList<string> roles)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["jwtkey"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("userId", user.Id),
                    roles.Contains("Admin") ? new Claim(ClaimTypes.Role, "Admin") : null
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
    }
}
