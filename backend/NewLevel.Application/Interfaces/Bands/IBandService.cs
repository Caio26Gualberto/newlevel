using NewLevel.Shared.DTOs.Bands;

namespace NewLevel.Application.Interfaces.Bands
{
    public interface IBandService
    {
        public Task<List<MemberInfoDto>> GetAllBandMembers();
        public Task<BandInfoByUser> GetBandByUser();
        public Task<bool> RemoveMemberByUserId(int userId);
        public Task<bool> UpdateBand(UpdateBandInput input);
    }
}
