using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.Medias;
using NewLevel.Dtos.Photo;
using NewLevel.Dtos.Utils;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Photo;
using NewLevel.Services.AmazonS3;
using NewLevel.Utils;

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

        public async Task<GenericList<PhotoResponseDto>> GetAllPhotos(Pagination input)
        {
            var allPhotos = await _context.Photos.Where(x => x.IsPublic).ToListAsync();
            int totalPhotos = allPhotos.Count;

            var skip = (input.Page - 1) * input.PageSize;

            var photos = await _context.Photos
                .Include(x => x.User)
                .Where(x => x.IsPublic)
                .WhereIf(!string.IsNullOrEmpty(input.Search), photo => photo.Title.ToLower().Contains(input.Search.ToLower()) || photo.Title.ToLower() == input.Search.ToLower())
                .OrderByDescending(photo => photo.CreationTime)
                .Skip(skip)
                .Take(input.PageSize)
                .ToListAsync();

            var response = new List<PhotoResponseDto>();
            var s3 = new AmazonS3Service();

            foreach (var photo in photos)
            {
                if (photo.PublicTimer == null || photo.PublicTimer < DateTime.UtcNow.AddHours(-3))
                {
                    var url = await s3.CreateTempURLS3("newlevel-images", photo.KeyS3);
                    response.Add(new PhotoResponseDto
                    {
                        Src = url,
                        AvatarSrc = photo.User.Avatar,
                        Title = photo.Title,
                        Subtitle = photo.Subtitle,
                        CaptureDate = photo.CaptureDate,
                        Nickname = photo.User.Nickname,
                        Description = photo.Description,
                    });

                    photo.UpdateMedia(photo.KeyS3, photo.Title, photo.Subtitle, photo.Description, photo.IsPublic, url, DateTime.Now.AddDays(2).AddHours(-3), photo.CaptureDate);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    response.Add(new PhotoResponseDto
                    {
                        Src = photo.PrivateURL,
                        AvatarSrc = photo.User.Avatar,
                        Title = photo.Title,
                        Subtitle = photo.Subtitle,
                        CaptureDate = photo.CaptureDate,
                        Nickname = photo.User.Nickname,
                        Description = photo.Description,
                    });
                }
            }

            return new GenericList<PhotoResponseDto>
            {
                TotalCount = totalPhotos,
                Items = response
            };
        }

        public async Task<bool> UploadPhoto(PhotoArchiveInput file)
        {
            DateTime formattedDate = DateTime.Parse(file.TakeAt);
            var userId = _httpContextAccessor.HttpContext!.Items["userId"]!.ToString();
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new Exception("Usuário não encontrado");

            var s3 = new AmazonS3Service();
            string key = "imagens/" + $"{file.Title}-{Guid.NewGuid()}";

            var photo = new NewLevel.Entities.Photo(key, file.Title, file.Subtitle, file.Description, false, DateTime.UtcNow.AddHours(-3), user.Id, formattedDate);
            _context.Photos.Add(photo);

            var awsResult = await s3.UploadFilesAsync("newlevel-images", key, file.File);

            if (!awsResult)
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

            await _context.SaveChangesAsync();

            return true;
        } 
    }
}
