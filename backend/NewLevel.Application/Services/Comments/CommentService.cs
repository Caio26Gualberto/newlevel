using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.Comments;
using NewLevel.Application.Services.Amazon;
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
        private readonly IRepository<Event> _eventRepository;
        private readonly IServiceProvider _serviceProvider;
        private readonly AmazonS3Service _s3Service;
        public CommentService(IRepository<Comment> repository, IRepository<Photo> photoRepository, IRepository<Media> mediaRepository, IRepository<Event> eventRepository,
            IServiceProvider serviceProvider, AmazonS3Service s3Service)
        {
            _repository = repository;
            _photoRepository = photoRepository;
            _mediaRepository = mediaRepository;
            _serviceProvider = serviceProvider;
            _s3Service = s3Service;
            _eventRepository = eventRepository;
        }

        public async Task<bool> SaveComment(ReceiveCommentDto input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            await _repository.AddAsync(new Comment
            {
                Text = input.Text,
                UserId = user.Id,
                MediaId = input.MediaId,
                PhotoId = input.PhotoId,
                EventId = input.EventId
            });

            return true;
        }

        public async Task<CommentsPhotoResponseDto> GetCommentsByMediaId(Pagination pagination, int mediaId)
        {
            var skip = (pagination.Page - 1) * pagination.PageSize;

            var media = await _mediaRepository.FirstOrDefaultAsync(x => x.Id == mediaId);

            var commentsFromDb = await _repository.GetAll()
                .Include(c => c.User)
                .Where(c => c.MediaId == media.Id)
                .ToListAsync();

            var commentDtos = await Task.WhenAll(commentsFromDb.Select(async x => new CommentsListDto
            {
                Comment = x.Text,
                DateOfComment = x.CreationTime,
                UserAvatarSrc = await _s3Service.GetOrGenerateAvatarPrivateUrl(x.User),
                UserName = x.User.Nickname
            }));

            return new CommentsPhotoResponseDto
            {
                Title = media.Title,
                Comments = commentDtos.ToList()
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

            var commentsDto = await Task.WhenAll(comments.Select(async x => new CommentsListDto
            {
                Comment = x.Text,
                DateOfComment = x.CreationTime,
                UserAvatarSrc = await _s3Service.GetOrGenerateAvatarPrivateUrl(x.User),
                UserName = x.User.Nickname
            }));

            return new CommentsPhotoResponseDto
            {
                Title = photo.Title,
                Comments = commentsDto.ToList()
            };
        }

        public async Task<CommentsPhotoResponseDto> GetCommentsByEventId(Pagination pagination, int eventId)
        {
            var skip = (pagination.Page - 1) * pagination.PageSize;

            var @event = await _eventRepository.FirstOrDefaultAsync(x => x.Id == eventId);

            var comments = await _repository.GetAll()
                .Include(x => x.User)
                .Where(x => x.EventId == @event.Id)
                .OrderByDescending(evt => evt.CreationTime)
                .Skip(skip)
                .Take(pagination.PageSize)
                .ToListAsync();

            var commentsDto = await Task.WhenAll(comments.Select(async x => new CommentsListDto
            {
                Comment = x.Text,
                DateOfComment = x.CreationTime,
                UserAvatarSrc = await _s3Service.GetOrGenerateAvatarPrivateUrl(x.User),
                UserName = x.User.Nickname
            }));

            return new CommentsPhotoResponseDto
            {
                Title = @event.Title,
                Comments = commentsDto.ToList()
            };
        }
    }
}
