using NewLevel.Domain.Interfaces.Seeding;

namespace NewLevel.Application.Services.Seeding
{
    public class SeedWorker
    {
        private readonly ISeedService _seedService;

        public SeedWorker(ISeedService seedService)
        {
            _seedService = seedService;
        }

        public async Task Seed()
        {
            await _seedService.SeedRolesAndAdminAsync();
        }
    }
}
