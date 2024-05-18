using Microsoft.AspNetCore.Identity;
using NewLevel.Context;
using NewLevel.Dtos.User;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Email;
using NewLevel.Interfaces.Services.User;
using NewLevel.Services.AmazonS3;

namespace NewLevel.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly NewLevelDbContext _newLevelDbContext;
        public UserService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, IEmailService emailService, NewLevelDbContext newLevelDbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _emailService = emailService;
            _newLevelDbContext = newLevelDbContext;
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

                user.Update(isFirstTimeLogin: false, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatar: null);
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

        public async Task<bool> UploadAvatarImage(UploadAvatarImageInput input)
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

            AmazonS3Service s3 = new AmazonS3Service();
            string key = $"avatars/{user.Id}";
            var result = await s3.UploadFilesAsync("newlevel-images", key, input.File);

            if (!result)
            {
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");
            }

            user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatar: key);
            await _userManager.UpdateAsync(user);
            await _newLevelDbContext.SaveChangesAsync();

            return true;
        }
    }
}
