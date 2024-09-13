using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.Band;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Band;

namespace NewLevel.Services.Band
{
    public class BandService : IBandService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly NewLevel.Utils.Utils _utils;
        private readonly NewLevelDbContext _context;

        public BandService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, NewLevelDbContext context)
        {
            _utils = new Utils.Utils(httpContextAccessor, userManager);
            _context = context;
        }

        public async Task<List<MemberInfoDto>> GetAllBandMembers()
        {
            var user = await _utils.GetUserAsync();
            var band = await _context.BandsUsers.Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            if (band == null)
            {
                throw new Exception("Banda não encontrada.");
            }

            var members = await _context.BandsUsers.Include(x => x.User).Where(x => x.BandId == band.Id).Select(x => new MemberInfoDto
            {
                UserId = x.UserId,
                Name = x.User.Nickname,
                AvatarURL = x.User.AvatarUrl,
                ProfileURL = $"http://localhost:3000/profile/{x.User.Nickname}/{x.User.Id}",
                Instrument = x.User.Instrument
            }).ToListAsync();

            var removeBand = members.FirstOrDefault(x => x.Name == band.Name);

            members.Remove(removeBand);

            return members;
        }

        public async Task<bool> RemoveMemberByUserId(string userId)
        {
            var bandMember = _context.BandsUsers.FirstOrDefault(x => x.UserId == userId);

            if (bandMember == null)
            {
                throw new Exception("Membro não encontrado.");
            }

            try
            {
                _context.BandsUsers.Remove(bandMember);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
    }
}
