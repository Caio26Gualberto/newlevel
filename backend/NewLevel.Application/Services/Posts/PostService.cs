using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.Posts;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Services.SignalR;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Enums.Like;
using NewLevel.Domain.Interfaces.Repositories.UnitOfWork;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Comments;
using NewLevel.Shared.DTOs.Medias;
using NewLevel.Shared.DTOs.Photos;
using NewLevel.Shared.DTOs.Posts;
using NewLevel.Shared.DTOs.Utils;
using NewLevel.Shared.Enums.Amazon;

namespace NewLevel.Application.Services.Posts
{
    public class PostService : IPostService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly StorageService _S3Service;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<PostsHub> _hubContext;
        private readonly IRepository<Post> _repository;
        private readonly IRepository<Like> _likesRepsitory;
        public PostService(IServiceProvider serviceProvider, StorageService s3Service, IUnitOfWork unitOfWork,
            IHubContext<PostsHub> hubContext, IRepository<Post> repository, IRepository<Like> likesRepository)
        {
            _serviceProvider = serviceProvider;
            _S3Service = s3Service;
            _unitOfWork = unitOfWork;
            _hubContext = hubContext;
            _repository = repository;
            _likesRepsitory = likesRepository;
        }

        public async Task<bool> CreatePostAsync(CreatePostInput input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var repository = _unitOfWork.Repository<Post>();
                var post = new Post
                {
                    Content = input.Text,
                    UserId = user.Id
                };

                await repository.AddAsync(post);

                List<Photo> photos = new List<Photo>();
                List<Media> medias = new List<Media>();

                int totalItems = (input.Photos?.Count ?? 0) + (input.Videos?.Count ?? 0);
                int current = 0;

                if (input.Photos != null && input.Photos.Any())
                {
                    foreach (var photo in input.Photos)
                    {
                        var key = _S3Service.CreateKey(EAmazonFolderType.PostPhoto, post.Id.ToString());
                        var result = await _S3Service.UploadFilesAsync(key, photo, EAmazonFolderType.PostPhoto);
                        photos.Add(new Photo
                        {
                            KeyS3 = key,
                            PostId = post.Id,
                            Title = photo.FileName,
                            Description = string.Empty,
                            CaptureDate = DateTime.UtcNow.AddHours(-3),
                            Subtitle = string.Empty,
                            IsPublic = true
                        });
                        current++;
                        await _hubContext.Clients.User(user.Id.ToString())
                            .SendAsync("UploadProgress", new
                            {
                                PostId = input.GuidSignalR,
                                Type = "photo",
                                Index = current,
                                Total = totalItems,
                                FileName = photo.FileName
                            });
                    }
                }

                if (input.Videos != null && input.Videos.Any())
                {
                    foreach (var video in input.Videos)
                    {
                        var key = _S3Service.CreateKey(EAmazonFolderType.PostMedia, post.Id.ToString());
                        var result = await _S3Service.UploadFilesAsync(key, video, EAmazonFolderType.PostMedia);

                        if (result)
                        {
                            medias.Add(new Media
                            {
                                KeyS3 = key,
                                PostId = post.Id,
                                Title = video.FileName,
                                Description = input.Text,
                                IsPublic = true,
                                UserId = user.Id
                            });
                        }
                        current++;
                        await _hubContext.Clients.User(user.Id.ToString())
                            .SendAsync("UploadProgress", new
                            {
                                PostId = input.GuidSignalR,
                                Type = "video",
                                Index = current,
                                Total = totalItems,
                                FileName = video.FileName
                            });
                    }
                }

                if (photos.Any())
                    post.Photos = photos;

                if (medias.Any())
                    post.Videos = medias;

                await _unitOfWork.CommitAsync();

                await _hubContext.Clients.User(user.Id.ToString())
                    .SendAsync("UploadCompleted", new
                    {
                        PostId = input.GuidSignalR,
                        Success = true
                    });

                return true;
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                await _hubContext.Clients.User(user.Id.ToString())
                    .SendAsync("UploadedCompleted", new { Success = false });

                throw;
            }
        }

        public async Task<GenericList<PostDto>> GetAll(Pagination input)
        {
            var skip = (input.Page - 1) * input.PageSize;

            var allPosts = await _repository.GetAll()
                .Include(x => x.Comments)
                .Include(x => x.Photos)
                .Include(x => x.Videos)
                .Include(x => x.User)
                .Where(x => x.Videos != null && x.Videos.Any(x => !string.IsNullOrEmpty(x.KeyS3)))
                .OrderByDescending(x => x.CreationTime)
                .Skip(skip)
                .Take(input.PageSize)
                .ToListAsync();

            var postsIds = allPosts.Select(x => x.Id).ToList();
            var likes = await _likesRepsitory.GetAll()
                .Where(x => x.TargetType == ETargetType.Post)
                .Where(x => postsIds.Contains(x.TargetId))
                .ToListAsync();

            int totalLikes = likes.Count;

            int totalPosts = allPosts.Count;

            var response = new List<PostDto>();

            foreach (var post in allPosts)
            {
                var photos = post.Photos != null && post.Photos.Any()
                    ? (await Task.WhenAll(post.Photos.Select(async p => new PhotoResponseDto
                    {
                        Id = p.Id,
                        Src = await _S3Service.GetOrGeneratePhotoPrivateUrl(p),
                        Title = p.Title,
                        Description = p.Description,
                        CaptureDate = p.CaptureDate,
                        Subtitle = p.Subtitle
                    }))).ToList()
                    : new List<PhotoResponseDto>();

                var comments = post.Comments != null && post.Comments.Any()
                    ? (await Task.WhenAll(post.Comments.Select(async c => new CommentsListDto
                    {
                        Comment = c.Text,
                        UserName = c.User.Nickname,
                        DateOfComment = c.CreationTime,
                        UserAvatarSrc = await _S3Service.GetOrGenerateAvatarPrivateUrl(c.User)
                    }))).ToList()
                    : new List<CommentsListDto>();

                var medias = post.Videos != null && post.Videos.Any()
                    ? (await Task.WhenAll(post.Videos.Select(async v => new MediaDto
                    {
                        Id = v.Id,
                        Title = v.Title,
                        Description = v.Description,
                        Src = await _S3Service.GetOrGenerateMediaPrivateUrl(v),
                    }))).ToList() : new List<MediaDto>();

                response.Add(new PostDto
                {
                    PostId = post.Id,
                    Content = post.Content,
                    CreatedAt = post.CreationTime,
                    Photos = photos,
                    Medias = medias,
                    Comments = comments,
                    CommentsCount = post.Comments?.Count ?? 0,
                    LikesCount = totalLikes,
                    IsLiked = likes.Any(x => x.UserId == post.UserId && x.TargetId == post.Id && x.TargetType == ETargetType.Post),
                    UserAvatar = await _S3Service.GetOrGenerateAvatarPrivateUrl(post.User),
                    UserName = post.User.Nickname
                });
            }

            return new GenericList<PostDto>
            {
                TotalCount = totalPosts,
                Items = response
            };
        }

        public async Task<PostDto> GetPost(int id)
        {
            var post = await _repository.GetAll()
                .Include(x => x.Comments)
                .Include(x => x.Photos)
                .Include(x => x.Videos)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (post == null)
                throw new Exception("Post não encontrado");

            return new PostDto
            {
                PostId = post.Id,
                Content = post.Content,
                CreatedAt = post.CreationTime,
                Photos = post.Photos != null && post.Photos.Any()
                    ? (await Task.WhenAll(post.Photos.Select(async p => new PhotoResponseDto
                    {
                        Id = p.Id,
                        Src = await _S3Service.GetOrGeneratePhotoPrivateUrl(p),
                        Title = p.Title,
                        Description = p.Description,
                        CaptureDate = p.CaptureDate,
                        Subtitle = p.Subtitle
                    }))).ToList()
                    : new List<PhotoResponseDto>(),
                Medias = post.Videos != null && post.Videos.Any()
                    ? (await Task.WhenAll(post.Videos.Select(async v => new MediaDto
                    {
                        Id = v.Id,
                        Title = v.Title,
                        Description = v.Description,
                        Src = await _S3Service.GetOrGenerateMediaPrivateUrl(v),
                    }))).ToList() : new List<MediaDto>(),
                Comments = post.Comments != null && post.Comments.Any()
                    ? (await Task.WhenAll(post.Comments.Select(async c => new CommentsListDto
                    {
                        Comment = c.Text,
                        UserName = c.User.Nickname,
                        DateOfComment = c.CreationTime,
                        UserAvatarSrc = await _S3Service.GetOrGenerateAvatarPrivateUrl(c.User)
                    }))).ToList() : new List<CommentsListDto>(),
                CommentsCount = post.Comments?.Count ?? 0,
                LikesCount = await _likesRepsitory.GetAll()
                    .Where(x => x.TargetType == ETargetType.Post)
                    .Where(x => x.TargetId == post.Id)
                    .CountAsync(),
                IsLiked = await _likesRepsitory.GetAll().AnyAsync(x => x.UserId == post.UserId && x.TargetId == post.Id && x.TargetType == ETargetType.Post),
                UserAvatar = await _S3Service.GetOrGenerateAvatarPrivateUrl(post.User),
                UserName = post.User.Nickname
            };
        }
    }
}
