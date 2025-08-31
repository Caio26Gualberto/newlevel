using NewLevel.Shared.DTOs.Likes;

namespace NewLevel.Application.Interfaces.Likes
{
    public interface ILikeService
    {
        Task<bool> Like(LikeInput input);
    }
}
