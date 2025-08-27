using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.Comments;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Comments;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Services.Comments
{
    public class CommentService : ICommentService
    {
        private readonly IRepository<Comment> _repository;
        private readonly IRepository<Photo> _photoRepository;
        private readonly IRepository<Media> _mediaRepository;
        private readonly IServiceProvider _serviceProvider;
        public CommentService(IRepository<Comment> repository, IRepository<Photo> photoRepository, IRepository<Media> mediaRepository, IServiceProvider serviceProvider)
        {
            _repository = repository;
            _photoRepository = photoRepository;
            _mediaRepository = mediaRepository;
            _serviceProvider = serviceProvider;
        }

        public async Task<bool> SaveComment(ReceiveCommentDto input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            await _repository.AddAsync(new Comment
            {
                Text = input.Text,
                UserId = user.Id,
                MediaId = input.MediaId,
                PhotoId = input.PhotoId
            });

            return true;
        }

        public async Task<CommentsPhotoResponseDto> GetCommentsByMediaId(Pagination pagination, int mediaId)
        {
            var skip = (pagination.Page - 1) * pagination.PageSize;

            var media = await _mediaRepository.FirstOrDefaultAsync(x => x.Id == mediaId);

            var comments = await _repository.GetAll()
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

            var photo = await _photoRepository.FirstOrDefaultAsync(x => x.Id == photoId);

            var comments = await _repository.GetAll()
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
    }
}
