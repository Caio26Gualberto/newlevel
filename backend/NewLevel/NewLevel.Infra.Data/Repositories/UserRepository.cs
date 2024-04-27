using Microsoft.EntityFrameworkCore;
using NewLevel.Infra.Data.Context;
using NewLevel.Infra.Data.Identity;
using NewLevel.Infra.Data.Interfaces.Repositories;

namespace NewLevel.Infra.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly NewLevelDbContext _context;

        public UserRepository(NewLevelDbContext context)
        {
            _context = context;
        }
        public IQueryable<User> GetAll()
        {
            return _context.Users.Where(x => true);
        }
    }
}
