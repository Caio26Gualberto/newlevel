using NewLevel.Dtos.Comment;
using NewLevel.Dtos.Utils;

namespace NewLevel.Interfaces.Services.Comment
{
    public interface ICommentService
    {
        public Task<CommentsPhotoResponseDto> GetCommentsByPhotoId(Pagination pagination, int photoId);
        public Task<CommentsPhotoResponseDto> GetCommentsByMediaId(Pagination pagination, int mediaId);
        public Task<bool> SaveComment(ReceiveCommentDto input);
    }
}
