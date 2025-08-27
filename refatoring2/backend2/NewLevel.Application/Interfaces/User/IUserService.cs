using NewLevel.Shared.DTOs.User;

namespace NewLevel.Application.Interfaces.User
{
    public interface IUserService
    {
        public Task<bool> DeleteAsync();
        public Task<bool> SkipIntroduction();
        public Task<UserInfoResponseDto> GetUserInfo();
        public Task<bool> UploadAvatarImage(UploadImageInput input);
        public Task<bool> UploadBannerImage(UploadImageInput input);
        public Task<bool> UpdateUser(UpdateUserInput input);
        public Task<ProfileInfoDto> GetProfile(string nickname, int userId);
        public Task<List<SearchBarUserDetailDto>> GetUsersForSearchBar(string nickname);
        public Task<bool> InviteMemberBand(InviteMemberInput input);
        public Task<bool> DeleteMemberInvite(string nickname);
        public Task<bool> ChangePassword();
        Task<bool> AddMemberToBand(int notificationId);
    }
}
