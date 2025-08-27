using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NewLevel.Application.Interfaces.Photos;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Utils.IQueryableExtensions;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Photos;
using NewLevel.Shared.DTOs.Utils;
using NewLevel.Shared.Enums.Amazon;

namespace NewLevel.Application.Services.Photos
{
    public class PhotoService : IPhotoService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly IRepository<Photo> _repository;
        public PhotoService(IServiceProvider serviceProvider, IConfiguration configuration, IRepository<Photo> repository)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _repository = repository;
        }

        public async Task<bool> ApprovePhoto(int photoId, bool isApprove)
        {
            var photo = await _repository.FirstOrDefaultAsync(x => x.Id == photoId);
            if (photo == null)
            {
                throw new Exception("Foto não encontrada");
            }

            photo.IsPublic = isApprove;
            await _repository.UpdateAsync(photo);

            return true;
        }

        public async Task<GenericList<PhotoResponseDto>> GetAllPhotos(Pagination input, bool isForApprove)
        {
            var allPhotos = await _repository.GetAll()
                .WhereIf(isForApprove, x => x.IsPublic == false)
                .WhereIf(!isForApprove, x => x.IsPublic)
                .ToListAsync();
            int totalPhotos = allPhotos.Count;

            var skip = (input.Page - 1) * input.PageSize;

            var photos = await _repository.GetAll()
                .Include(x => x.User)
                .WhereIf(isForApprove, x => x.IsPublic == false)
                .WhereIf(!isForApprove, x => x.IsPublic)
                .WhereIf(!string.IsNullOrEmpty(input.Search), photo => photo.Title.ToLower().Contains(input.Search.ToLower()) || photo.Title.ToLower() == input.Search.ToLower())
                .OrderByDescending(photo => photo.CreationTime)
                .Skip(skip)
                .Take(input.PageSize)
                .ToListAsync();

            var response = new List<PhotoResponseDto>();
            var s3 = new AmazonS3Service(_configuration);

            foreach (var photo in photos)
            {
                if (photo.PublicTimer == null || photo.PublicTimer < DateTime.UtcNow.AddHours(-3))
                {
                    var url = await s3.CreateTempURLS3(photo.KeyS3, EAmazonFolderType.Photo);
                    response.Add(new PhotoResponseDto
                    {
                        Id = photo.Id,
                        Src = url,
                        AvatarSrc = await GetOrGenerateAvatarPrivateUrl(photo),
                        Title = photo.Title,
                        Subtitle = photo.Subtitle,
                        CaptureDate = photo.CaptureDate,
                        Nickname = photo.User.Nickname,
                        Description = photo.Description,
                        UserId = photo.UserId
                    });

                    photo.PrivateURL = url;
                    photo.PublicTimer = DateTime.Now.AddDays(2).AddHours(-3); 
                    await _repository.UpdateAsync(photo);
                }
                else
                {
                    response.Add(new PhotoResponseDto
                    {
                        Id = photo.Id,
                        Src = photo.PrivateURL,
                        AvatarSrc = await GetOrGenerateAvatarPrivateUrl(photo),
                        Title = photo.Title,
                        Subtitle = photo.Subtitle,
                        CaptureDate = photo.CaptureDate,
                        Nickname = photo.User.Nickname,
                        Description = photo.Description,
                        UserId = photo.UserId
                    });
                }
            }

            return new GenericList<PhotoResponseDto>
            {
                TotalCount = totalPhotos,
                Items = response
            };
        }

        public async Task<bool> UploadPhoto(PhotoArchiveInput file)
        {
            DateTime formattedDate = DateTime.Parse(file.TakeAt);
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            if (user == null)
                throw new Exception("Usuário não encontrado");

            var s3 = new AmazonS3Service(_configuration);
            var key = s3.CreateKey(EAmazonFolderType.Photo, file.Title);

            Photo photo = new Photo             
            {
                KeyS3 = key,
                Title = file.Title,
                Subtitle = file.Subtitle,
                Description = file.Description,
                UserId = user.Id,
                CaptureDate = formattedDate
            };
            await _repository.AddAsync(photo);


            var awsResult = await s3.UploadFilesAsync(key, file.File, EAmazonFolderType.Photo);

            if (!awsResult)
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

            await _repository.AddAsync(photo);

            return true;
        }

        private async Task<string> GetOrGenerateAvatarPrivateUrl(Photo photo)
        {
            if (photo.User.PublicTimerAvatar == null || photo.User.PublicTimerAvatar < DateTime.UtcNow.AddHours(-3))
            {
                var s3 = new AmazonS3Service(_configuration);
                var url = await s3.CreateTempURLS3(photo.KeyS3, EAmazonFolderType.Photo);

                photo.User.PublicTimerAvatar = DateTime.Now.AddDays(2).AddHours(-3);
                photo.User.AvatarUrl = url;

                await _repository.UpdateAsync(photo);
                return url;
            }
            else
            {
                return photo.User.AvatarUrl!;
            }
        }
    }
}
