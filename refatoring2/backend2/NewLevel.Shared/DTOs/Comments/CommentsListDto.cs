namespace NewLevel.Shared.DTOs.Comments
{
    public class CommentsListDto
    {
        public string Comment { get; set; }
        public string UserName { get; set; }
        public string UserAvatarSrc { get; set; }
        public DateTime DateOfComment { get; set; }
    }
}
