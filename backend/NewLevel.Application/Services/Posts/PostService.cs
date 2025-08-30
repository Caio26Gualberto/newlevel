using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.Posts;
using NewLevel.Application.Interfaces.Youtube;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Services.SignalR;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
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
        private readonly AmazonS3Service _S3Service;
        private readonly IYoutubeService _youtubeService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<PostsHub> _hubContext;
        private readonly IRepository<Post> _repository;
        public PostService(IServiceProvider serviceProvider, AmazonS3Service s3Service, IYoutubeService youtubeService, IUnitOfWork unitOfWork, 
            IHubContext<PostsHub> hubContext, IRepository<Post> repository)
        {
            _serviceProvider = serviceProvider;
            _S3Service = s3Service;
            _youtubeService = youtubeService;
            _unitOfWork = unitOfWork;
            _hubContext = hubContext;
            _repository = repository;
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
                        current++;
                        await _hubContext.Clients.User(user.Id.ToString())
                            .SendAsync("UploadProgress", new
                            {
                                PostId = post.Id,
                                Type = "photo",
                                Index = current,
                                Total = totalItems
                            });

                        var key = _S3Service.CreateKey(EAmazonFolderType.PostPhoto, post.Id.ToString());
                        var url = await _S3Service.UploadFilesAsync(key, photo, EAmazonFolderType.PostPhoto);
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
                    }
                }

                if (input.Videos != null && input.Videos.Any())
                {
                    foreach (var video in input.Videos)
                    {
                        current++;
                        await _hubContext.Clients.User(user.Id.ToString())
                            .SendAsync("UploadProgress", new
                            {
                                PostId = post.Id,
                                Type = "video",
                                Index = current,
                                Total = totalItems
                            });

                        var youtubeVideoId = await _youtubeService.UploadVideoToYoutube(video, video.FileName, input.Text);
                        if (youtubeVideoId != null)
                        {
                            medias.Add(new Media
                            {
                                PostId = post.Id,
                                Title = video.FileName,
                                Description = input.Text,
                                YoutubeId = youtubeVideoId,
                                IsPublic = true,
                                Src = $"https://www.youtube.com/embed/{youtubeVideoId}"
                            });
                        }
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
                        PostId = post.Id,
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
                .Where(x => x.Videos != null && x.Videos.Any(x => !string.IsNullOrEmpty(x.YoutubeId)))
                .OrderByDescending(x => x.CreationTime)
                .Skip(skip)
                .Take(input.PageSize)
                .ToListAsync();

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

                response.Add(new PostDto
                {
                    PostId = post.Id,
                    Content = post.Content,
                    CreatedAt = post.CreationTime,
                    Photos = photos,
                    Medias = post.Videos?.Select(v => new MediaDto
                    {
                        Id = v.Id,
                        Title = v.Title,
                        Description = v.Description,
                        Src = v.Src
                    }).ToList() ?? new List<MediaDto>(),
                    Comments = comments,
                    CommentsCount = post.Comments?.Count ?? 0
                });
            }

            return new GenericList<PostDto>
            {
                TotalCount = totalPosts,
                Items = response
            };
        }
    }
}
