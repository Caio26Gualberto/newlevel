using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NewLevel.Domain.Entities;
using NewLevel.Infra.Data.Identity;

namespace NewLevel.Infra.Data.Context
{
    public class NewLevelDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public NewLevelDbContext(DbContextOptions<NewLevelDbContext> options) : base(options)
        { }

        public new DbSet<User> Users { get; set; } = null!;
        public DbSet<Media> Medias { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Band> Bands { get; set; }
        public DbSet<BandsUsers> BandsUsers { get; set; }
        public DbSet<SystemNotification> SystemNotifications { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(NewLevelDbContext).Assembly);

            // Configuração 1:1 entre IdentityUser e User do domínio
            builder.Entity<ApplicationUser>()
                .HasOne(a => a.User)
                .WithOne()
                .HasForeignKey<ApplicationUser>(a => a.DomainUserId)
                .OnDelete(DeleteBehavior.Cascade);

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
