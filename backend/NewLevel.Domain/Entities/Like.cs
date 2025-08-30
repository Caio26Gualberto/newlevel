using NewLevel.Domain.Enums.Like;

namespace NewLevel.Domain.Entities
{
    public class Like : EntityBase
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int TargetId { get; set; }
        public ETargetType TargetType { get; set; }
        }
}
