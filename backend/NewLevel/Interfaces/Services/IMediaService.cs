using NewLevel.Dtos;

namespace NewLevel.Interfaces.Services
{
    public interface IMediaService
    {
        Task<List<MediaDto>> GetAllMedias();
        Task<bool> RequestMedia(RequestMediaDto input);
    }
}
