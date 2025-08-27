using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.Bands;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Bands;

namespace NewLevel.Application.Services.Bands
{
    public class BandService : IBandService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IRepository<Band> _repository;
        private readonly IRepository<BandsUsers> _bandsUsers;
        public BandService(IServiceProvider serviceProvider, IRepository<Band> repository, IRepository<BandsUsers> bandsRepository)
        {
            _serviceProvider = serviceProvider;
            _repository = repository;
            _bandsUsers = bandsRepository;
        }

        public async Task<bool> RemoveMemberByUserId(int userId)
        {
            var bandMember = _bandsUsers.GetAll().FirstOrDefault(x => x.UserId == userId);

            if (bandMember == null)
            {
                throw new Exception("Membro não encontrado.");
            }

            try
            {
                await _bandsUsers.DeleteAsync(bandMember);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<BandInfoByUser> GetBandByUser()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var band = await _bandsUsers.GetAll().Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            User? integrant = new User();

            if (band != null)
            {
                integrant = await _bandsUsers.GetAll().Include(x => x.User)
                    .Where(x => x.BandId == band.Id)
                    .Where(x => x.UserId == user.Id)
                    .Select(x => x.User)
                    .FirstOrDefaultAsync();

                return new BandInfoByUser
                {
                    BandProfileURL = $"/profile/{band.Name}/{band.Id}",
                    BandName = band.Name
                };
            }

            return new BandInfoByUser
            {
                BandName = null,
                BandProfileURL = null
            };
        }

        public async Task<List<MemberInfoDto>> GetAllBandMembers()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var band = await _bandsUsers.GetAll().Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            if (band == null)
            {
                throw new Exception("Banda não encontrada.");
            }

            var members = await _bandsUsers.GetAll().Include(x => x.User).Where(x => x.BandId == band.Id).Select(x => new MemberInfoDto
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
    }
}
