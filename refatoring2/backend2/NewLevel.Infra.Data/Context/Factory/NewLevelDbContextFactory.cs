using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NewLevel.Infra.Data.Context.Factory
{
    public class NewLevelDbContextFactory : IDesignTimeDbContextFactory<NewLevelDbContext>
    {
        public NewLevelDbContext CreateDbContext(string[] args)
        {
            var connectionString = Environment.GetEnvironmentVariable("NewLevelDb");

            if (string.IsNullOrEmpty(connectionString))
                throw new InvalidOperationException("Environment variable 'NewLevelDb' not set.");

            var optionsBuilder = new DbContextOptionsBuilder<NewLevelDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new NewLevelDbContext(optionsBuilder.Options);
        }
    }
}
