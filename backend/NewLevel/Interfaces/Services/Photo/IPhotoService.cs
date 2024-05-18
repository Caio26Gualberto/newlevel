using NewLevel.Dtos.Photo;
using NewLevel.Dtos.Utils;

namespace NewLevel.Interfaces.Services.Photo
{
    public interface IPhotoService
    {
        Task<bool> UploadPhoto(PhotoArchiveInput file);
        Task<GenericList<PhotoResponseDto>> GetAllPhotos(Pagination input);
    }
}
