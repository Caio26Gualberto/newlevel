using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
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
        private readonly NewLevel.Utils.Utils _utils;
        public UserService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, IEmailService emailService, NewLevelDbContext newLevelDbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _emailService = emailService;
            _newLevelDbContext = newLevelDbContext;
            _utils = new Utils.Utils(httpContextAccessor, userManager);
        }

        public async Task GenerateTokenToResetPasswordByEmail(string email)
        {
            var user = await _utils.GetUser();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var (body, subject) = EmailService.MakeResetPasswordTemplate(token);

            await _emailService.SendEmail(user.Email!, subject, body);
        }

        public async Task<UserInfoResponseDto> GetUserInfo()
        {
            var user = await _utils.GetUser();

            return new UserInfoResponseDto
            {
                Nickname = user.Nickname,
                ActivityLocation = user.ActivityLocation,
                Email = user.Email,
                Password = user.PasswordHash,
                ProfilePicture = user.AvatarUrl,
            };
        }
        public async Task<bool> Delete()
        {
            try
            {
                var user = await _utils.GetUser();

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
                var user = await _utils.GetUser();

                user.Update(isFirstTimeLogin: false, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatar: user.AvatarKey, publicTimer: user.PublicTimer, avatarUrl: user.AvatarUrl, email: user.Email);
                await _userManager.UpdateAsync(user);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public async Task GenerateTokenToResetPassword()
        {
            var user = await _utils.GetUser();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var (body, subject) = EmailService.MakeResetPasswordTemplate(token);

            await _emailService.SendEmail(user.Email!, subject, body);
        }

        public async Task<bool> UploadAvatarImage(UploadAvatarImageInput input)
        {
            var user = await _utils.GetUser();

            AmazonS3Service s3 = new AmazonS3Service();
            string key = $"avatars/{user.Id}/{Guid.NewGuid()}";
            var result = await s3.UploadFilesAsync("newlevel-images", key, input.File);
            var url = await s3.CreateTempURLS3("newlevel-images", key);

            if (!result)
            {
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");
            }

            user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatar: key, publicTimer: DateTime.Now.AddDays(2).AddHours(-3),
                avatarUrl: url, email: user.Email);
            await _userManager.UpdateAsync(user);
            await _newLevelDbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateUser(UpdateUserInput input)
        {
            User user = await _utils.GetUser();
            AmazonS3Service s3 = new AmazonS3Service();
            string key = $"avatars/{user.Id}/{Guid.NewGuid()}";

            if (input.File != null)
            {
                var isUploaded = await s3.UploadFilesAsync("newlevel-images", key, input.File);

                if (!isUploaded)
                    throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

                if (!string.IsNullOrEmpty(user.AvatarKey))
                {
                    var fileDeleted = await s3.DeleteFileAsync("newlevel-images", user.AvatarKey);
                    if (!fileDeleted)
                        throw new Exception("Erro ao deletar imagem antiga, caso o problema persista entre em contato com o desenvolvedor");
                }

                var url = await s3.CreateTempURLS3("newlevel-images", key);
                user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: input.Nickname ?? user.Nickname, activityLocation: input.ActivityLocation ?? user.ActivityLocation, avatar: key, publicTimer: DateTime.Now.AddDays(2).AddHours(-3), avatarUrl: url, email: input.Email);
                await _userManager.UpdateAsync(user);
                await _newLevelDbContext.SaveChangesAsync();
            }
            else
            {
                user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: input.Nickname ?? user.Nickname, activityLocation: input.ActivityLocation ?? user.ActivityLocation, avatar: user.AvatarUrl, publicTimer: DateTime.Now.AddDays(2).AddHours(-3), avatarUrl: user.AvatarUrl, email: input.Email);
                await _userManager.UpdateAsync(user);
                await _newLevelDbContext.SaveChangesAsync();
            }

            return true;

        }
    }
}
