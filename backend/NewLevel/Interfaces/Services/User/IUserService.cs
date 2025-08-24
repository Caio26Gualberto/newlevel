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
        public Task<bool> UploadAvatarImage(UploadImageInput input);
        public Task<bool> UploadBannerImage(UploadImageInput input);
        public Task<bool> UpdateUser(UpdateUserInput input);
        Task<bool> ResetPassword(ResetPasswordInput input);
        Task<ProfileInfoDto> GetProfile(string nickname, int userId);
        Task<List<SearchBarUserDetailDto>> GetUsersForSearchBar(string nickname);
        Task<bool> InviteMemberBand(InviteMemberInput input);
        Task<bool> AddMemberToBand(int notificationId);
        Task<bool> DeleteMemberInvite(string nickname);
    }
}
