using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NewLevel.Application.Interfaces.User;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Services.Auth;
using NewLevel.Application.Utils;
using NewLevel.Application.Utils.Enum;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Enums.Band;
using NewLevel.Domain.Enums.SystemNotification;
using NewLevel.Domain.Enums.User;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Auth;
using NewLevel.Shared.DTOs.User;
using NewLevel.Shared.Enums.Amazon;
using System.Text.RegularExpressions;

namespace NewLevel.Application.Services.DomainUser
{
    public class UserService : IUserService
    {
        private readonly IRepository<User> _repository;
        private readonly IRepository<Band> _bandRepository;
        private readonly IRepository<BandsUsers> _bandsUsersRepository;
        private readonly IRepository<SystemNotification> _systemNotificationRepository;
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly AuthAppService _authService;
        private readonly AmazonS3Service _s3Service;
        public UserService(IRepository<User> repository, IServiceProvider serviceProvider, IConfiguration configuration, IRepository<Band> bandRepository,
            IRepository<BandsUsers> bandsUsersRepository, IRepository<SystemNotification> systemNotificationRepository, AuthAppService authenticateService, 
            AmazonS3Service s3Service)
        {
            _repository = repository;
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _bandRepository = bandRepository;
            _bandsUsersRepository = bandsUsersRepository;
            _systemNotificationRepository = systemNotificationRepository;
            _authService = authenticateService;
            _s3Service = s3Service;
        }

        public async Task<bool> DeleteAsync()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            await _repository.DeleteAsync(user);

            return true;
        }

        public async Task<bool> AddMemberToBand(int notificationId)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var notification = await _systemNotificationRepository.FirstOrDefaultAsync(x => x.Id == notificationId);
            var bandId = Convert.ToInt32(notification!.HiddenInfos!.Replace("ID da Banda:", "").Trim());
            string instrument = Regex.Match(notification.Message, @"como\s(.*)").Groups[1].Value;

            var band = await _bandsUsersRepository.GetAll().Include(x => x.Band).FirstOrDefaultAsync(x => x.BandId == bandId);

            if (band != null)
            {
                try
                {
                    await _bandsUsersRepository.AddAsync(new BandsUsers
                    {
                        BandId = bandId,
                        UserId = user.Id
                    });

                    notification.IsRead = true;
                    await _systemNotificationRepository.UpdateAsync(notification);
                    user.Instrument = instrument;
                    await _repository.UpdateAsync(user);

                    await _systemNotificationRepository.AddAsync(new SystemNotification
                    {
                        Title = "Convite aceito",
                        Message = $"{user.Nickname} aceitou seu convite para tocar na banda {band.Band.Name}",
                        SystemNotificationType = ESystemNotificationType.Simple,
                        UserId = band.UserId
                    });
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }

            return true;
        }

        public async Task<UserInfoResponseDto> GetUserInfo()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            //Todo tratar esse nulo depois no front
            if (user.IsFirstTimeLogin)
                return null;

            return new UserInfoResponseDto
            {
                Id = user.Id,
                Nickname = user.Nickname,
                Email = user.Email,
                ProfilePicture = string.IsNullOrEmpty(user.AvatarKey) ? null : await _s3Service.GetOrGenerateAvatarPrivateUrl(user),
                ProfileBanner = string.IsNullOrEmpty(user.BannerKey) ? null : await _s3Service.GetOrGenerateBannerPrivateUrl(user),
                BannerPosition = user.BannerPosition
            };
        }

        public async Task<bool> SkipIntroduction()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            user.IsFirstTimeLogin = false;
            await _repository.UpdateAsync(user);

            return true;
        }

        public async Task<bool> DeleteMemberInvite(string nickname)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var memberInvited = _repository.FirstOrDefaultAsync(x => x.Nickname == nickname);
            var band = await _bandsUsersRepository.GetAll().Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            try
            {
                var notification = await _systemNotificationRepository.FirstOrDefaultAsync(x => x.Message.Contains(band.Name) && x.UserId == memberInvited.Id);

                await _systemNotificationRepository.DeleteAsync(notification);
                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> InviteMemberBand(InviteMemberInput input)
        {
            try
            {
                var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
                var band = await _bandsUsersRepository.GetAll()
                            .Where(x => x.UserId == user.Id)
                            .Select(x => x.Band)
                            .FirstOrDefaultAsync();

                if (band == null)
                    throw new Exception("Você não possui uma banda para convidar membros");

                bool notificationExists = await _systemNotificationRepository.GetAll()
                                        .AnyAsync(n => n.UserId == input.UserInvited.UserId
                                        && n.SystemNotificationType == ESystemNotificationType.Invite
                                        && n.Message.Contains(band.Name) && !n.IsRead && !n.IsDeleted);

                if (notificationExists)
                {
                    throw new Exception("Você já enviou um convite a esse usuário, aguarde a resposta do mesmo");
                }

                SystemNotification systemNotification = new SystemNotification()
                {
                    Title = "Convite para banda",
                    Message = $"Você foi convidado para tocar na banda {band.Name} como {input.Instrument}",
                    SystemNotificationType = ESystemNotificationType.Invite,
                    HiddenInfos = $"ID da Banda: {band.Id}",
                    UserId = input.UserInvited.UserId
                };

                await _systemNotificationRepository.AddAsync(systemNotification);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<List<SearchBarUserDetailDto>> GetUsersForSearchBar(string nickname)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            if (string.IsNullOrEmpty(nickname))
            {
                return new List<SearchBarUserDetailDto>();
            }

            var lowerSearchTerm = nickname.ToLower();

            var usersFromDb = await _repository.GetAll()
                .Where(x => x.Id != user.Id)
                .Where(u => u.Nickname.ToLower().Contains(lowerSearchTerm) ||
                            u.Email.ToLower().Contains(lowerSearchTerm))
                .Take(10)
                .ToListAsync();

            var users = await Task.WhenAll(usersFromDb.Select(async u => new SearchBarUserDetailDto
            {
                UserId = u.Id,
                NickName = u.Nickname,
                AvatarUrl = await _s3Service.GetOrGenerateAvatarPrivateUrl(u)
            }));

            return users.ToList();
        }

        public async Task<ProfileInfoDto> GetProfile(string nickname, int userId)
        {
            var searchedUser = await _repository.GetAll().Include(x => x.Photos)
                .Include(x => x.Medias).FirstOrDefaultAsync(x => x.Id == userId);

            if (searchedUser == null)
            {
                var band = await _bandRepository.FirstOrDefaultAsync(x => x.Id == userId);
                var bandUserId = await _bandsUsersRepository.GetAll().Where(x => x.BandId == band.Id && x.IsBand).Select(x => x.UserId).FirstOrDefaultAsync();

                searchedUser = await _repository.GetAll().Include(x => x.Photos)
                    .Include(x => x.Medias).FirstOrDefaultAsync(x => x.Id == bandUserId);
            }

            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            if (searchedUser == null)
                throw new Exception("Não foi possivel encontrar o usuário selecionado");

            var searchedBand = await _bandsUsersRepository.GetAll().Include(bandUser => bandUser.Band)
                .Where(x => x.UserId == searchedUser.Id && x.IsBand)
                .Select(bandUser => bandUser.Band)
                .FirstOrDefaultAsync();

            List<User>? integrants = new List<User>();

            if (searchedBand != null)
            {
                integrants = await _bandsUsersRepository.GetAll().Include(x => x.User)
                    .Where(x => x.BandId == searchedBand.Id && !x.IsBand)
                    .Select(x => x.User)
                    .ToListAsync();
            }

            var bannerUrl = await _s3Service.GetOrGenerateBannerPrivateUrl(searchedUser);
            var avatarUrl = await _s3Service.GetOrGenerateAvatarPrivateUrl(searchedUser);

            List<IntegrantInfoDto>? integrantsWithUrl = null;
            if (searchedBand != null && integrants != null)
            {
                integrantsWithUrl = (await Task.WhenAll(integrants.Select(async integrant => new IntegrantInfoDto
                {
                    Name = integrant.Nickname,
                    Instrument = integrant.Instrument,
                    ProfileUrl = $"/profile/{integrant.Nickname}/{integrant.Id}",
                    AvatarUrl = await _s3Service.GetOrGenerateAvatarPrivateUrl(integrant)
                }))).ToList();
            }

            List<ProfileInfoPhotoDto>? profileInfoPhotos = null;
            if (searchedUser?.Photos != null)
            {
                profileInfoPhotos = (await Task.WhenAll(searchedUser.Photos.Select(async photo => new ProfileInfoPhotoDto
                {
                    Id = photo.Id,
                    Title = photo.Title,
                    PhotoSrc = await _s3Service.GetOrGeneratePhotoPrivateUrl(photo)
                }))).ToList();
            }

            var profileInfoVideos = searchedUser?.Medias?.Select(media => new ProfileInfoVideoDto
            {
                Id = media.Id,
                MediaSrc = media.Src,
                Title = media.Title,
            }).ToList();

            return new ProfileInfoDto
            {
                Name = searchedUser.Nickname,
                Banner = new BannerInfos
                {
                    Position = searchedUser.BannerPosition,
                    URL = bannerUrl
                },
                CityName = EnumHelper<EActivityLocation>.GetDisplayValue(searchedUser.ActivityLocation),
                AvatarUrl = avatarUrl,
                IsEnabledToEdit = user.Id == searchedUser.Id,
                Band = searchedBand == null ? null : new BandDto
                {
                    InstagramUrl = searchedBand.InstagramUrl,
                    SpotifyUrl = searchedBand.SpotifyUrl,
                    YoutubeUrl = searchedBand.YoutubeUrl,
                    CreatedAt = searchedBand.CreatedAt,
                    Description = searchedBand.Description,
                    IsVerified = searchedBand.IsVerified,
                    MusicGenres = EnumHelper<EMusicGenres>.GetDisplayValues(searchedBand.MusicGenres),
                    Integrants = searchedBand.Integrants,
                    IntegrantsWithUrl = integrantsWithUrl
                },
                ProfileInfoPhotos = profileInfoPhotos,
                ProfileInfoVideos = profileInfoVideos
            };

        }
        
        public async Task<bool> UpdateUser(UpdateUserInput input)
        {
            User user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            if (input.File != null)
            {
                var key = _s3Service.CreateKey(EAmazonFolderType.Avatars, user.Id.ToString());
                var isUploaded = await _s3Service.UploadFilesAsync(key, input.File, EAmazonFolderType.Avatars);

                if (!isUploaded)
                    throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

                if (!string.IsNullOrEmpty(user.AvatarKey))
                {
                    var fileDeleted = await _s3Service.DeleteFileAsync(user.AvatarKey, EAmazonFolderType.Avatars);
                    if (!fileDeleted)
                        throw new Exception("Erro ao deletar imagem antiga, caso o problema persista entre em contato com o desenvolvedor");
                }

                user.AvatarKey = key;
                await _s3Service.GetOrGenerateAvatarPrivateUrl(user);

                PatchHelper.Patch(user, input);
            }
            else
            {
                PatchHelper.Patch(user, input);
            }
            user.UpdatedAt = DateTime.UtcNow.AddHours(-3);
            await _repository.UpdateAsync(user);
            return true;

        }

        public async Task<bool> UploadBannerImage(UploadImageInput input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            if (!string.IsNullOrEmpty(user.BannerKey))
            {
                await _s3Service.DeleteFileAsync(user.BannerKey, EAmazonFolderType.Banner);
            }

            var key = _s3Service.CreateKey(EAmazonFolderType.Banner, user.Id.ToString());
            var result = await _s3Service.UploadFilesAsync(key, input.File, EAmazonFolderType.Banner);

            if (!result)
            {
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");
            }

            user.BannerKey = key;
            user.BannerPosition = input.Position;
            await _s3Service.GetOrGenerateBannerPrivateUrl(user);

            user.UpdatedAt = DateTime.UtcNow.AddHours(-3);
            await _repository.UpdateAsync(user);

            return true;
        }

        public async Task<bool> UploadAvatarImage(UploadImageInput input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            var key = _s3Service.CreateKey(EAmazonFolderType.Avatars, user.Id.ToString());
            var result = await _s3Service.UploadFilesAsync(key, input.File, EAmazonFolderType.Avatars);

            if (!result)
            {
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");
            }

            user.AvatarKey = key;
            await _s3Service.GetOrGenerateAvatarPrivateUrl(user);
            user.UpdatedAt = DateTime.UtcNow.AddHours(-3);
            await _repository.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ChangePassword()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            await _authService.ForgotPassword(new ForgotPasswordRequestDto
            {
                Email = user.Email
            });

            return true;
        }
    }
}
