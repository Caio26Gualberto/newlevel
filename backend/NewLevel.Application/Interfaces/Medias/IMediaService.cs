using NewLevel.Shared.DTOs.Medias;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Interfaces.Medias
{
    public interface IMediaService
    {
        public Task<GenericList<MediaDto>> GetAllMedias(Pagination input, bool isForApprove);
        public Task<bool> RequestMedia(RequestMediaDto input);
        public Task<bool> DeleteMediaById(int id);
        public Task<GenericList<MediaByUserIdDto>> GetMediaByUserId(Pagination input);
        public Task<bool> UpdateMediaById(UpdateMediaByIdInput input);
        public Task<bool> ApproveMedia(ApproveMediaInput input);
    }
}
