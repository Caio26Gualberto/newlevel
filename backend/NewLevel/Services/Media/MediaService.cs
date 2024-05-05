using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos;
using NewLevel.Interfaces.Services;

namespace NewLevel.Services.Media
{
    public class MediaService : IMediaService
    {
        private readonly NewLevelDbContext _context;
        public MediaService(NewLevelDbContext newLevelDb)
        {
            _context = newLevelDb;
        }
        public async Task<List<MediaDto>> GetAllMedias()
        {
            return await _context.Medias.Select(media => new MediaDto
            {
                Src = media.Src,
                Title = media.Title,
                CreationTime = media.CreationTime,
            }).ToListAsync();
        }
    }
}
