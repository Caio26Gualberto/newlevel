using NewLevel.Dtos.Medias;
using NewLevel.Dtos.Utils;

namespace NewLevel.Interfaces.Services.Media
{
    public interface IMediaService
    {
        Task<GenericList<MediaDto>> GetAllMedias(Pagination input);
        Task<bool> RequestMedia(RequestMediaDto input);
        Task<bool> DeleteMediaById(int id);
        Task<GenericList<MediaByUserIdDto>> GetMediaByUserId(Pagination input);
        Task<bool> UpdateMediaById(UpdateMediaByIdInput input);
    }
}
