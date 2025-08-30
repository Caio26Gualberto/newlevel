using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NewLevel.Domain.Entities;
using NewLevel.Infra.Data.Identity;
using System.Reflection.Emit;

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
        public DbSet<BandVerificationRequest> BandVerificationRequests { get; set; }
        public DbSet<Post> Posts { get; set; }

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
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>()
                .HasMany(u => u.Medias)
                .WithOne(c => c.User)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>()
                .HasMany(u => u.BandsUsers)
                .WithOne(bu => bu.User)
                .HasForeignKey(bu => bu.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>()
                .HasMany(u => u.SystemNotifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>()
                .HasMany(u => u.OrganizedEvents)
                .WithOne(e => e.Organizer)
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<User>()
                .HasMany(u => u.Photos)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

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

            // Configuração do relacionamento eventos e bandas (muitos-para-muitos)
            builder.Entity<Event>()
             .HasMany(e => e.Bands)
             .WithMany(b => b.Events)
             .UsingEntity<Dictionary<string, object>>(
                 "EventBands", // nome da tabela de junção
                 j => j.HasOne<Band>()
                       .WithMany()
                       .HasForeignKey("BandId")
                       .OnDelete(DeleteBehavior.Cascade),
                 j => j.HasOne<Event>()
                       .WithMany()
                       .HasForeignKey("EventId")
                       .OnDelete(DeleteBehavior.Cascade),
                 j =>
                 {
                     j.HasKey("EventId", "BandId"); // chave composta
                     j.ToTable("EventBands");       // nome explícito da tabela
                 }
             );

            builder.Entity<Event>()
                .HasMany(e => e.Photos)
                .WithOne(p => p.Event)
                .HasForeignKey(p => p.EventId)
                .OnDelete(DeleteBehavior.Cascade); // se deletar evento, apaga fotos

            builder.Entity<Event>()
                .HasMany(e => e.Comments)
                .WithOne(c => c.Event)
                .HasForeignKey(c => c.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Event>()
                .HasOne(e => e.Organizer)
                .WithMany(u => u.OrganizedEvents)
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Band>()
                .HasOne(b => b.VerificationRequest)
                .WithOne(v => v.Band)
                .HasForeignKey<BandVerificationRequest>(v => v.BandId)
                .OnDelete(DeleteBehavior.Cascade);

            // Post -> Photo (1:N)
            builder.Entity<Post>()
                .HasMany(p => p.Photos)
                .WithOne(photo => photo.Post) 
                .HasForeignKey(photo => photo.PostId) 
                .OnDelete(DeleteBehavior.Cascade); // se deletar o post, deleta as fotos

            // Post -> Media (1:N)
            builder.Entity<Post>()
                .HasMany(p => p.Videos)
                .WithOne(media => media.Post)
                .HasForeignKey(media => media.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            // Post -> User (N:1)
            builder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict); // não deletar usuário ao deletar post
        }
    }
}
