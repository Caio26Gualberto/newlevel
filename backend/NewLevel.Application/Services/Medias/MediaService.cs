using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.Medias;
using NewLevel.Application.Interfaces.Youtube;
using NewLevel.Application.Utils;
using NewLevel.Application.Utils.IQueryableExtensions;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Medias;
using NewLevel.Shared.DTOs.Utils;

namespace NewLevel.Application.Services.Medias
{
    public class MediaService : IMediaService
    {
        private readonly IRepository<Media> _repository;
        private readonly IServiceProvider _serviceProvider;
        private readonly IYoutubeService _youtubeService;
        public MediaService(IRepository<Media> repository, IServiceProvider serviceProvider, IYoutubeService service)
        {
            _repository = repository;
            _serviceProvider = serviceProvider;
            _youtubeService = service;
        }

        public async Task<bool> ApproveMedia(ApproveMediaInput input)
        {
            if (input.IsApproved)
            {
                var media = await _repository.GetAll().Include(x => x.User).FirstOrDefaultAsync(media => media.Id == input.MediaId);
                if (media == null)
                    return false;

                media.IsPublic = true;
                await _repository.UpdateAsync(media);

                object templateObj = new { Title = media.Title };

                //await _emailService.SendEmail(media.User.Email!, "Música aprovada", "Sua música foi aprovada com sucesso!", "d-d5d5e7ddb40143fa927cf11dbef70783", templateObj);
                return true;
            }
            else
            {
                var media = await _repository.GetAll().Include(x => x.User).FirstOrDefaultAsync(media => media.Id == input.MediaId);
                if (media == null)
                    return false;

                object templateObj = new { Title = media.Title };
                //await _emailService.SendEmail(media.User.Email!, "Música aprovada", "Sua música foi aprovada com sucesso!", "d-7fc323d4b3b547dcadc728e1c6a06f5f ", templateObj);

                return false;
            }
        }

        public async Task<bool> UpdateMediaById(UpdateMediaByIdInput input)
        {
            var media = await _repository.FirstOrDefaultAsync(media => media.Id == input.MediaId);

            if (media == null)
                return false;

            PatchHelper.Patch(media, input);
            await _repository.UpdateAsync(media);
            return true;
        }

        public async Task<GenericList<MediaByUserIdDto>> GetMediaByUserId(Pagination input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            var totalMedias = await _repository.GetAll()
                .Where(media => media.UserId == user.Id)
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .CountAsync();

            var skip = (input.Page - 1) * input.PageSize;

            var mediaList = await _repository.GetAll()
                .Where(media => media.UserId == user.Id)
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .Skip(skip)
                .Take(input.PageSize)
                .Select(media => new MediaByUserIdDto
                {
                    Id = media.Id,
                    Url = media.Src,
                    Title = media.Title,
                    Description = media.Description,
                })
                .ToListAsync();

            return new GenericList<MediaByUserIdDto>
            {
                Items = mediaList,
                TotalCount = totalMedias
            };
        }

        public async Task<bool> DeleteMediaById(int id)
        {
            var media = await _repository.FirstOrDefaultAsync(media => media.Id == id);
            if (media == null)
                return false;

            await _repository.DeleteAsync(media);

            return true;
        }

        public async Task<bool> RequestMedia(RequestMediaDto input)
        {
            try
            {
                var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

                await _repository.AddAsync(new Media
                {
                    Src = input.Src.Replace("watch?v=", "embed/"),
                    Title = input.Title,
                    Description = input.Description,
                    UserId = user.Id,
                });

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<GenericList<MediaDto>> GetAllMedias(Pagination input, bool isForApprove)
        {
            var totalMedias = await _repository.GetAll()
                .WhereIf(!isForApprove, x => x.IsPublic)
                .WhereIf(isForApprove, x => x.IsPublic == false)
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .CountAsync();

            var skip = (input.Page - 1) * input.PageSize;

            var medias = await _repository.GetAll()
                .Include(x => x.User)
                .WhereIf(!isForApprove, x => x.IsPublic)
                .WhereIf(isForApprove, x => x.IsPublic == false)
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .OrderByDescending(media => media.CreationTime)
                .Skip(skip)
                .Take(input.PageSize)
                .Select(media => new MediaDto
                {
                    Id = media.Id,
                    Src = media.Src,
                    Title = media.Title,
                    CreationTime = media.CreationTime,
                    Nickname = media.User.Nickname,
                    Description = media.Description,
                })
                .ToListAsync();

            return new GenericList<MediaDto>
            {
                Items = medias,
                TotalCount = totalMedias
            };
        }

        public async Task<bool> UploadVideoToYoutube(RequestMediaDto request)
        {
            var videoId = await _youtubeService.UploadVideoToYoutube(request.File, request.Title, request.Description);
            return true;
        }
    }
}
