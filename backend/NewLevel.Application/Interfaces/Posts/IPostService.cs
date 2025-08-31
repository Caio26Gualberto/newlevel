using NewLevel.Shared.DTOs.Posts;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Interfaces.Posts
{
    public interface IPostService
    {
        public Task<bool> CreatePostAsync(CreatePostInput input);
        public Task<GenericList<PostDto>> GetAll(Pagination input);
        public Task<PostDto> GetPost(int id);
    }
}
