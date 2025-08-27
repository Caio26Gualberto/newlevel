using NewLevel.Dtos.Band;

namespace NewLevel.Interfaces.Services.Band
{
    public interface IBandService
    {
        Task<List<MemberInfoDto>> GetAllBandMembers();
        Task<BandInfoByUser> GetBandByUser();
        Task<bool> RemoveMemberByUserId(int userId);
    }
}
