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
        private readonly AmazonS3Service _s3Service;
        public PhotoService(IServiceProvider serviceProvider, IConfiguration configuration, IRepository<Photo> repository, AmazonS3Service s3Service)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _repository = repository;
            _s3Service = s3Service;
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
                .Where(x => x.UserId != null)
                .Skip(skip)
                .Take(input.PageSize)
                .ToListAsync();

            var response = new List<PhotoResponseDto>();

            foreach (var photo in photos)
            {
                response.Add(new PhotoResponseDto
                {
                    Id = photo.Id,
                    Src = await _s3Service.GetOrGeneratePhotoPrivateUrl(photo),
                    AvatarSrc = await _s3Service.GetOrGenerateAvatarPrivateUrl(photo.User),
                    Title = photo.Title,
                    Subtitle = photo.Subtitle,
                    CaptureDate = photo.CaptureDate,
                    Nickname = photo.User.Nickname,
                    Description = photo.Description,
                    UserId = (int)photo.UserId
                });
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

            var key = _s3Service.CreateKey(EAmazonFolderType.Photo, file.Title);

            Photo photo = new Photo             
            {
                KeyS3 = key,
                Title = file.Title,
                Subtitle = file.Subtitle,
                Description = file.Description,
                UserId = user.Id,
                CaptureDate = formattedDate
            };

            var awsResult = await _s3Service.UploadFilesAsync(key, file.File, EAmazonFolderType.Photo);

            if (!awsResult)
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

            await _repository.AddAsync(photo);

            return true;
        }
    }
}
