using NewLevel.Dtos.Photo;

namespace NewLevel.Interfaces.Services.Photo
{
    public interface IPhotoService
    {
        Task<bool> UploadPhoto(PhotoArchiveInput file);
    }
}
