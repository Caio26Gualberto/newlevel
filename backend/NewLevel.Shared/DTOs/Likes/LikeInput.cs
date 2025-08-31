using NewLevel.Domain.Enums.Like;

namespace NewLevel.Shared.DTOs.Likes
{
    public class LikeInput
    {
        public int TargetId { get; set; }
        public ETargetType TargetType { get; set; }
    }
}
