using Microsoft.AspNetCore.Identity;
using NewLevel.Context;
using NewLevel.Dtos.Photo;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Photo;
using NewLevel.Services.AmazonS3;

namespace NewLevel.Services.Photo
{
    public class PhotoService : IPhotoService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly NewLevelDbContext _context;
        public PhotoService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, NewLevelDbContext newLevelDbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _context = newLevelDbContext;
        }
        public async Task<bool> UploadPhoto(PhotoArchiveInput file)
        {
            var userId = _httpContextAccessor.HttpContext!.Items["userId"]!.ToString();
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new Exception("Usuário não encontrado");

            var s3 = new AmazonS3Service();
            string key = "imagens/" + $"{file.Title}-{Guid.NewGuid()}";

            var photo = new NewLevel.Entities.Photo(key, file.Title, file.Subtitle, file.Description, true, DateTime.UtcNow.AddHours(-3), user.Id);
            _context.Photos.Add(photo);

            var awsResult = await s3.UploadFilesAsync("newlevel-images", key, file.File);

            if (!awsResult)
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
