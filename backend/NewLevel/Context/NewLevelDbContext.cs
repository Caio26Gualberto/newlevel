using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NewLevel.Entities;
using System.Reflection.Emit;

namespace NewLevel.Context
{
    public class NewLevelDbContext : IdentityDbContext<User>
    {
        public NewLevelDbContext(DbContextOptions<NewLevelDbContext> options) : base(options)
        { }

        public DbSet<Media> Medias { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(NewLevelDbContext).Assembly);

            // Configurações para o Identity
            builder.Entity<User>(entity =>
            {
                entity.ToTable(name: "Users");
            });

            builder.Entity<IdentityRole>(entity =>
            {
                entity.ToTable(name: "Roles");
            });
            builder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.ToTable("UserRoles");
            });

            builder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.ToTable("UserClaims");
            });

            builder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.ToTable("UserLogins");
            });

            builder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.ToTable("RoleClaims");
            });

            builder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.ToTable("UserTokens");
            });

            builder.Entity<User>()
                        .HasMany(u => u.Comments)
                        .WithOne(c => c.User)
                        .HasForeignKey(c => c.UserId)
                        .OnDelete(DeleteBehavior.Restrict);

            // Configuração da entidade Media
            builder.Entity<Media>()
                .HasMany(m => m.Comments)
                .WithOne(c => c.Media)
                .HasForeignKey(c => c.MediaId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuração da entidade Photo
            builder.Entity<Photo>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Photo)
                .HasForeignKey(c => c.PhotoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
