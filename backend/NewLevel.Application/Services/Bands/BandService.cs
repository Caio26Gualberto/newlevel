using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NewLevel.Application.Interfaces.Bands;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Utils;
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
        private readonly AmazonS3Service _s3Service;
        private readonly IConfiguration _configuration;
        public BandService(IServiceProvider serviceProvider, IRepository<Band> repository, IRepository<BandsUsers> bandsRepository, AmazonS3Service s3Service,
            IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _repository = repository;
            _bandsUsers = bandsRepository;
            _s3Service = s3Service;
            _configuration = configuration;
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
            string basePath = _configuration["Frontend:Url"];
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var band = await _bandsUsers.GetAll().Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            if (band == null)
            {
                throw new Exception("Banda não encontrada.");
            }

            var membersFromDb = await _bandsUsers.GetAll()
                .Include(x => x.User)
                .Where(x => x.BandId == band.Id)
                .ToListAsync();

            var members = await Task.WhenAll(membersFromDb.Select(async x => new MemberInfoDto
            {
                UserId = x.UserId,
                Name = x.User.Nickname,
                AvatarURL = await _s3Service.GetOrGenerateAvatarPrivateUrl(x.User),
                ProfileURL = $"{basePath}/profile/{x.User.Nickname}/{x.User.Id}",
                Instrument = x.User.Instrument
            }));

            var result = members.ToList();
            var removeBand = members.FirstOrDefault(x => x.Name == band.Name);

            result.Remove(removeBand);

            return result;
        }

        public async Task<bool> UpdateBand(UpdateBandInput input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var band = await _bandsUsers.GetAll().Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            if (band == null)
                throw new Exception("Banda não encontrada, caso o erro persista favor entrar em contato com o desenvolvedor");

            PatchHelper.Patch(band, input);

            if (input.MusicGenres != null)
                band.MusicGenres = input.MusicGenres;

            band.UpdatedAt = DateTime.UtcNow.AddHours(-3);
            await _repository.UpdateAsync(band);

            return true;
        }
    }
}
