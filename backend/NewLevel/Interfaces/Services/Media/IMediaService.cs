using NewLevel.Dtos.Medias;
using NewLevel.Dtos.Utils;

namespace NewLevel.Interfaces.Services.Media
{
    public interface IMediaService
    {
        Task<GenericList<MediaDto>> GetAllMedias(Pagination input);
        Task<bool> RequestMedia(RequestMediaDto input);
    }
}
