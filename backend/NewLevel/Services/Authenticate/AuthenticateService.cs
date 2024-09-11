using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
            var band = await _newLevelDbContext.BandsUsers
                        .Include(bu => bu.Band)
                        .Where(bu => bu.UserId == user.Id)
                        .Select(bu => bu.Band)
                        .FirstOrDefaultAsync();


            if (user == null)
            {
                return new TokensDto();
            }

            var refreshToken = await _userManager.GetAuthenticationTokenAsync(user, loginProvider: "email", tokenName: "refresh_token");
            var result = await _userManager.VerifyUserTokenAsync(user, tokenProvider: "local", purpose: "email", refreshToken);
            var roles = await _userManager.GetRolesAsync(user);

            if (band != null && band.IsVerified)
                roles.Add("Band");

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
                var band = await _newLevelDbContext.BandsUsers.Include(bu => bu.Band).Where(bu => bu.UserId == user.Id).Select(bu => bu.Band).FirstOrDefaultAsync();
                var roles = await _userManager.GetRolesAsync(user);

                if (band != null && band.IsVerified)
                    roles.Add("Band");

                var tokenString = GenerateJwtToken(user, roles);

                user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatarKey: user.AvatarKey,
                    publicTimer: user.PublicTimer, avatarUrl: user.AvatarUrl, email: user.Email);

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
                var userCreated = await _userManager.FindByEmailAsync(input.Email);
                await _signInManager.SignInAsync(user, isPersistent: false);
                return new RegisterResponseDto { Result = true, Message = "Conta criada!", UserId = userCreated.Id };
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

            using (var transaction = await _newLevelDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var user = await Register(new RegisterInputDto
                    {
                        Email = input.Email,
                        Nickname = input.Nickname,
                        Password = input.Password,
                        ActivityLocation = input.ActivityLocation
                    });

                    var band = new Band(
                        input.Nickname,
                        input.Description,
                        isVerified: false,
                        DateTime.UtcNow.AddHours(-3),
                        (DateTime)input.CreatedAt,
                        musicGenres: input.MusicGenres,
                        integrants: input.Integrants,
                        isFirstTimeLogin: true,
                        input.Nickname,
                        avatar: null,
                        input.ActivityLocation,
                        publicTimer: null,
                        avatarUrl: null,
                        input.Email
                    );

                    _newLevelDbContext.Bands.Add(band);

                    await _newLevelDbContext.SaveChangesAsync();

                    var bandUser = new BandsUsers
                    {
                        BandId = band.Id,
                        UserId = user.UserId
                    };

                    _newLevelDbContext.BandsUsers.Add(bandUser);

                    await _newLevelDbContext.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return new RegisterResponseDto
                    {
                        Result = true,
                        Message = "Banda registrada com sucesso"
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    throw new Exception("Ocorreu um erro durante o registro da banda.", ex);
                }
            }

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
                    roles.Contains("Admin") ? new Claim(ClaimTypes.Role, "Admin") : null,
                    roles.Contains("Band") ? new Claim(ClaimTypes.Role, "Band") : null
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
