using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.Comment;
using NewLevel.Dtos.Utils;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Comment;
using NewLevel.Utils;

namespace NewLevel.Services.Comment
{
    public class CommentService : ICommentService
    {
        private readonly NewLevelDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly Utils.Utils _utils;
        public CommentService(NewLevelDbContext newLevelDbContext, IHttpContextAccessor httpContextAccessor, UserManager<User> userManager)
        {
            _context = newLevelDbContext;
            _utils = new Utils.Utils(httpContextAccessor, userManager);

        }

        public async Task<CommentsPhotoResponseDto> GetCommentsByMediaId(Pagination pagination, int mediaId)
        {
            var skip = (pagination.Page - 1) * pagination.PageSize;

            var media = await _context.Medias.FirstOrDefaultAsync(x => x.Id == mediaId);

            var comments = await _context.Comments
                .Include(x => x.User)
                .Where(x => x.MediaId == mediaId)
                .OrderByDescending(photo => photo.CreationTime)
                .Skip(skip)
                .Take(pagination.PageSize)
                .ToListAsync();

            return new CommentsPhotoResponseDto
            {
                Title = media.Title,
                Comments = comments.Select(x => new CommentsListDto
                {
                    Comment = x.Text,
                    DateOfComment = x.CreationTime,
                    UserAvatarSrc = x.User.AvatarUrl,
                    UserName = x.User.Nickname
                }).ToList()
            };
        }

        public async Task<CommentsPhotoResponseDto> GetCommentsByPhotoId(Pagination pagination, int photoId)
        {         
            var skip = (pagination.Page - 1) * pagination.PageSize;

            var photo = await _context.Photos.FirstOrDefaultAsync(x => x.Id == photoId);

            var comments = await _context.Comments
                .Include(x => x.User)
                .Where(x => x.PhotoId == photoId)
                .OrderByDescending(photo => photo.CreationTime)
                .Skip(skip)
                .Take(pagination.PageSize)
                .ToListAsync();

            return new CommentsPhotoResponseDto
            {
                Title = photo.Title,
                Comments = comments.Select(x => new CommentsListDto
                {
                    Comment = x.Text,
                    DateOfComment = x.CreationTime,
                    UserAvatarSrc = x.User.AvatarUrl,
                    UserName = x.User.Nickname
                }).ToList()
            };
        }

        public async Task<bool> SaveComment(ReceiveCommentDto input)
        {
            var user = await _utils.GetUser();

            var comment = new Entities.Comment(input.Text, user.Id, input.MediaId, input.PhotoId, DateTime.Now.AddHours(-3));
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
