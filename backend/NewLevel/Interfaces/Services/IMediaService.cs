using NewLevel.Dtos;

namespace NewLevel.Interfaces.Services
{
    public interface IMediaService
    {
        Task<GenericList<MediaDto>> GetAllMedias(Pagination input);
        Task<bool> RequestMedia(RequestMediaDto input);
    }
}
