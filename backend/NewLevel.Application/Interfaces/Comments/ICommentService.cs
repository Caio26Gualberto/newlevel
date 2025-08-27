using NewLevel.Shared.DTOs.Comments;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Interfaces.Comments
{
    public interface ICommentService
    {
        public Task<CommentsPhotoResponseDto> GetCommentsByPhotoId(Pagination pagination, int photoId);
        public Task<CommentsPhotoResponseDto> GetCommentsByMediaId(Pagination pagination, int mediaId);
        public Task<bool> SaveComment(ReceiveCommentDto input);


    }
}
