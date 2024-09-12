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
        public DbSet<Band> Bands { get; set; }
        public DbSet<BandsUsers> BandsUsers { get; set; }
        public DbSet<SystemNotification> SystemNotifications { get; set; }

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

            // Configuração da tabela de junção
            builder.Entity<BandsUsers>()
                .HasKey(bu => new { bu.BandId, bu.UserId });

            builder.Entity<BandsUsers>()
                .HasOne(bu => bu.Band)
                .WithMany(b => b.BandsUsers)
                .HasForeignKey(bu => bu.BandId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<BandsUsers>()
                .HasOne(bu => bu.User)
                .WithMany(u => u.BandsUsers)
                .HasForeignKey(bu => bu.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuração do relacionamento notificações
            builder.Entity<User>()
                .HasMany(u => u.SystemNotifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId);
        }
    }
}
