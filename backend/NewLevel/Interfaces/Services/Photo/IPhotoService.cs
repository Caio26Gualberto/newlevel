using NewLevel.Dtos.Photo;
using NewLevel.Dtos.Utils;

namespace NewLevel.Interfaces.Services.Photo
{
    public interface IPhotoService
    {
        Task<bool> UploadPhoto(PhotoArchiveInput file);
        Task<bool> ApprovePhoto(int photoId, bool isApprove);
        Task<GenericList<PhotoResponseDto>> GetAllPhotos(Pagination input, bool isForApprove);
    }
}
