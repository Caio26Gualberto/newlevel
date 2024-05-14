using Microsoft.AspNetCore.Identity;
using NewLevel.Dtos.User;
using NewLevel.Entities;
using NewLevel.Interfaces.Email;
using NewLevel.Interfaces.Services.User;

namespace NewLevel.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        public UserService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, IEmailService emailService)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _emailService = emailService;

        }

        public async Task GenerateTokenToResetPasswordByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var (body, subject) = EmailService.MakeResetPasswordTemplate(token);

            await _emailService.SendEmail(user.Email!, subject, body);
        }

        public async Task<UserInfoResponseDto> GetUserInfo()
        {
            var userId = _httpContextAccessor.HttpContext.Items["userId"];

            if (userId == null)
            {
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
            }
            var user = await _userManager.FindByIdAsync(userId.ToString()!);

            if (user == null)
            {
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
            }

            return new UserInfoResponseDto
            {
                Nickname = user.Nickname,
                ActivityLocation = user.ActivityLocation,
                Email = user.Email,
                Password = user.PasswordHash,
                ProfilePicture = null,
            };
        }
        public async Task<bool> Delete()
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext.Items["userId"];
                if (userId == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                var result = await _userManager.DeleteAsync(user);

                return result.Succeeded;    
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public async Task SkipIntroduction()
        {
            try
            {
                var userId = _httpContextAccessor.HttpContext.Items["userId"];
                if (userId == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
                }

                user.Update(isFirstTimeLogin: false, nickName: user.Nickname, activityLocation: user.ActivityLocation);
                await _userManager.UpdateAsync(user);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            
        }

        public async Task GenerateTokenToResetPassword()
        {
            var userId = _httpContextAccessor.HttpContext!.Items["userId"];

            if (userId == null)
            {
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
            }
            var user = await _userManager.FindByIdAsync(userId.ToString()!);

            if (user == null)
            {
                throw new Exception("Usuário não encontrado, favor entrar em contato com o desenvolvedor.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var (body, subject) = EmailService.MakeResetPasswordTemplate(token);

            await _emailService.SendEmail(user.Email!, subject, body);
        }
    }
}
