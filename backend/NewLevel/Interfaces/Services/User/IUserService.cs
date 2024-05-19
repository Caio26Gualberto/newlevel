using NewLevel.Dtos.User;

namespace NewLevel.Interfaces.Services.User
{
    public interface IUserService
    {
        public Task<bool> Delete();
        public Task SkipIntroduction();
        public Task<UserInfoResponseDto> GetUserInfo();
        public Task GenerateTokenToResetPassword();
        public Task GenerateTokenToResetPasswordByEmail(string email);
        public Task<bool> UploadAvatarImage(UploadAvatarImageInput input);
        public Task<bool> UpdateUser(UpdateUserInput input);
    }
}
