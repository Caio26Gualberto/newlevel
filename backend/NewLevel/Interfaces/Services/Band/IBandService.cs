using NewLevel.Dtos.Band;

namespace NewLevel.Interfaces.Services.Band
{
    public interface IBandService
    {
        Task<List<MemberInfoDto>> GetAllBandMembers();
        Task<bool> RemoveMemberByUserId(string userId);
    }
}
