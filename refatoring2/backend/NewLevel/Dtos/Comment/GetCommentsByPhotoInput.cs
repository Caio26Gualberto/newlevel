using NewLevel.Dtos.Utils;

namespace NewLevel.Dtos.Comment
{
    public class GetCommentsByPhotoInput
    {
        public int PhotoId { get; set; }
        public Pagination Pagination { get; set; }
    }
}
