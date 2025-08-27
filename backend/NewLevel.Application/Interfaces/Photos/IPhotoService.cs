using NewLevel.Shared.DTOs.Photos;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Interfaces.Photos
{
    public interface IPhotoService
    {
        public Task<bool> UploadPhoto(PhotoArchiveInput file);
        public Task<GenericList<PhotoResponseDto>> GetAllPhotos(Pagination input, bool isForApprove);
        public Task<bool> ApprovePhoto(int photoId, bool isApprove);
    }
}
