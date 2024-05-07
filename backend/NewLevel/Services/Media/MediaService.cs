using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos;
using NewLevel.Entities;
using NewLevel.Interfaces.Services;
using NewLevel.Utils;

namespace NewLevel.Services.Media
{
    public class MediaService : IMediaService
    {
        private readonly NewLevelDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        public MediaService(NewLevelDbContext newLevelDb, IHttpContextAccessor httpContextAccessor, UserManager<User> userManager)
        {
            _context = newLevelDb;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }
        //TODO limitar para publicos
        public async Task<GenericList<MediaDto>> GetAllMedias(Pagination input)
        {
            var totalMedias = await _context.Medias
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .CountAsync();

            var skip = (input.Page - 1) * input.PageSize;

            var medias = await _context.Medias
                .Include(x => x.User)
                .WhereIf(!string.IsNullOrEmpty(input.Search), media => media.Title.ToLower().Contains(input.Search.ToLower()) || media.Title.ToLower() == input.Search.ToLower())
                .OrderByDescending(media => media.CreationTime)
                .Skip(skip)
                .Take(input.PageSize)
                .Select(media => new MediaDto
                {
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
                var userId = _httpContextAccessor.HttpContext.Items["userId"].ToString();
                var user = await _userManager.FindByIdAsync(userId);
                NewLevel.Entities.Media media = new NewLevel.Entities.Media(input.Src, input.Title, input.Description, isPublic: false, DateTime.UtcNow.AddHours(-3), userId);
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
    }
}
