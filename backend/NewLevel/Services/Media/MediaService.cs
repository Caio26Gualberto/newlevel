using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.Medias;
using NewLevel.Dtos.Utils;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Email;
using NewLevel.Interfaces.Services.Media;
using NewLevel.Utils;

namespace NewLevel.Services.Media
{
    public class MediaService : IMediaService
    {
        private readonly NewLevelDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly Utils.Utils _utils;
        private readonly IEmailService _emailService;
        public MediaService(NewLevelDbContext newLevelDb, IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, IEmailService emailService)
        {
            _context = newLevelDb;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _utils = new Utils.Utils(httpContextAccessor, userManager);
            _emailService = emailService;

        }

        public async Task<bool> UpdateMediaById(UpdateMediaByIdInput input)
        {
            var media = await _context.Medias.FirstOrDefaultAsync(media => media.Id == input.MediaId);

            if (media == null)
                return false;

            media.UpdateMedia(media.Src, media.Title, input.Description, media.IsPublic);
            _context.Medias.Update(media);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<GenericList<MediaByUserIdDto>> GetMediaByUserId(Pagination input)
        {
            var user = await _utils.GetUserAsync();

            var totalMedias = await _context.Medias
                .Where(media => media.UserId == user.Id)
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .CountAsync();

            var skip = (input.Page - 1) * input.PageSize;

            var mediaList = await _context.Medias
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
            var media = await _context.Medias.FirstOrDefaultAsync(media => media.Id == id);
            if (media == null)
                return false;

            _context.Medias.Remove(media);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<GenericList<MediaDto>> GetAllMedias(Pagination input, bool isForApprove)
        {
            var totalMedias = await _context.Medias
                .WhereIf(!isForApprove, x => x.IsPublic)
                .WhereIf(isForApprove, x => x.IsPublic == false)
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .CountAsync();

            var skip = (input.Page - 1) * input.PageSize;

            var medias = await _context.Medias
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

        public async Task<bool> RequestMedia(RequestMediaDto input)
        {
            try
            {
                var user = await _utils.GetUserAsync();
                NewLevel.Entities.Media media = new NewLevel.Entities.Media(input.Src, input.Title, input.Description, isPublic: false, DateTime.UtcNow.AddHours(-3), user.Id);
                media.Src = media.Src.Replace("watch?v=", "embed/");

                await _context.Medias.AddAsync(media);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> ApproveMedia(int mediaId, bool isApprove)
        {
            if (isApprove)
            {
                var media = await _context.Medias.Include(x => x.User).FirstOrDefaultAsync(media => media.Id == mediaId);
                if (media == null)
                    return false;

                media.UpdateMedia(media.Src, media.Title, media.Description, isPublic: true);
                _context.Medias.Update(media);

                object templateObj = new { Title = media.Title };

                //await _emailService.SendEmail(media.User.Email!, "Música aprovada", "Sua música foi aprovada com sucesso!", "d-d5d5e7ddb40143fa927cf11dbef70783", templateObj);

                await _context.SaveChangesAsync();

                return true;
            }
            else
            {
                var media = await _context.Medias.Include(x => x.User).FirstOrDefaultAsync(media => media.Id == mediaId);
                if (media == null)
                    return false;

                object templateObj = new { Title = media.Title };
                //await _emailService.SendEmail(media.User.Email!, "Música aprovada", "Sua música foi aprovada com sucesso!", "d-7fc323d4b3b547dcadc728e1c6a06f5f ", templateObj);

                return false;
            }
        }
    }
}
