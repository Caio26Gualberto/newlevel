﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.User;
using NewLevel.Entities;
using NewLevel.Enums;
using NewLevel.Enums.Authenticate;
using NewLevel.Interfaces.Services.Email;
using NewLevel.Interfaces.Services.User;
using NewLevel.Services.AmazonS3;
using NewLevel.Utils;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace NewLevel.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly NewLevelDbContext _context;
        private readonly NewLevel.Utils.Utils _utils;
        private readonly IConfiguration _configuration;
        public UserService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, IEmailService emailService, NewLevelDbContext newLevelDbContext, IConfiguration configuration)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _emailService = emailService;
            _context = newLevelDbContext;
            _utils = new Utils.Utils(httpContextAccessor, userManager);
            _configuration = configuration;
        }

        public async Task GenerateTokenToResetPasswordByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var (body, subject) = EmailService.MakeResetPasswordTemplate(token, user.Id);

            //await _emailService.SendEmail(user.Email!, subject, body);
        }

        public async Task<UserInfoResponseDto> GetUserInfo()
        {
            var user = await _utils.GetUserAsync();
            //Todo tratar esse nulo depois no front
            if (user.IsFirstTimeLogin)
                return null;

            return new UserInfoResponseDto
            {
                Id = user.Id,
                Nickname = user.Nickname,
                Email = user.Email,
                Password = user.PasswordHash,
                ProfilePicture = string.IsNullOrEmpty(user.AvatarUrl) ? null : await GetOrSetAvatarURL(user),
                ProfileBanner = string.IsNullOrEmpty(user.BannerUrl) ? null : await GetOrSetBannerURL(user),
                BannerPosition = user.BannerPosition
            };
        }

        private async Task<string> GetOrSetAvatarURL(User user)
        {
            if (user.PublicTimerAvatar == null || user.PublicTimerAvatar < DateTime.UtcNow.AddHours(-3))
            {
                AmazonS3Service s3 = new AmazonS3Service(_configuration);
                string key = user.AvatarKey!;
                var url = await s3.CreateTempURLS3(AmazonS3Service.Bucket, key);
                return url;
            }

            return user.AvatarUrl!;
        }

        private async Task<string> GetOrSetBannerURL(User user)
        {
            if (user.PublicTimerBanner == null || user.PublicTimerBanner < DateTime.UtcNow.AddHours(-3))
            {
                AmazonS3Service s3 = new AmazonS3Service(_configuration);
                string key = user.BannerKey!;
                var url = await s3.CreateTempURLS3(AmazonS3Service.Bucket, key);
                return url;
            }

            return user.BannerUrl!;
        }
        public async Task<bool> Delete()
        {
            try
            {
                var user = await _utils.GetUserAsync();

                var result = await _userManager.DeleteAsync(user);

                return result.Succeeded;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public async Task SkipIntroduction()
        {
            try
            {
                var user = await _utils.GetUserAsync();

                user.Update(false, null, null, null, null,
                    null, null, null, null, null, null, null, null);

                await _userManager.UpdateAsync(user);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public async Task GenerateTokenToResetPassword()
        {
            var user = await _utils.GetUserAsync();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var (body, subject) = EmailService.MakeResetPasswordTemplate(token, user.Id);

            //await _emailService.SendEmail(user.Email!, subject, body);
        }

        public async Task<bool> UploadAvatarImage(UploadImageInput input)
        {
            var user = await _utils.GetUserAsync();

            AmazonS3Service s3 = new AmazonS3Service(_configuration);
            string key = $"avatars/{user.Id}/{Guid.NewGuid()}";
            var result = await s3.UploadFilesAsync(AmazonS3Service.Bucket, key, input.File);
            var url = await s3.CreateTempURLS3(AmazonS3Service.Bucket, key);

            if (!result)
            {
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");
            }

            user.Update(null, null, key, null, publicTimer: DateTime.Now.AddDays(2).AddHours(-3),
                 url, null, null, null, null, null, null, null);

            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UploadBannerImage(UploadImageInput input)
        {
            var user = await _utils.GetUserAsync();
            AmazonS3Service s3 = new AmazonS3Service(_configuration);

            if (!string.IsNullOrEmpty(user.BannerKey))
            {
                await s3.DeleteFileAsync(AmazonS3Service.Bucket, user.BannerKey);
            }

            string key = $"banners/{user.Id}/{Guid.NewGuid()}";
            var result = await s3.UploadFilesAsync(AmazonS3Service.Bucket, key, input.File);
            var url = await s3.CreateTempURLS3(AmazonS3Service.Bucket, key);

            if (!result)
            {
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");
            }

            user.Update(null, null, null, null,
                null, null, null, bannerKey: key, bannerUrl: url, input.Position, DateTime.Now.AddDays(2).AddHours(-3), null, null);

            await _userManager.UpdateAsync(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateUser(UpdateUserInput input)
        {
            User user = await _utils.GetUserAsync();
            AmazonS3Service s3 = new AmazonS3Service(_configuration);
            string key = $"avatars/{user.Id}/{Guid.NewGuid()}";

            if (input.File != null)
            {
                var isUploaded = await s3.UploadFilesAsync(AmazonS3Service.Bucket, key, input.File);

                if (!isUploaded)
                    throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

                if (!string.IsNullOrEmpty(user.AvatarKey))
                {
                    var fileDeleted = await s3.DeleteFileAsync(AmazonS3Service.Bucket, user.AvatarKey);
                    if (!fileDeleted)
                        throw new Exception("Erro ao deletar imagem antiga, caso o problema persista entre em contato com o desenvolvedor");
                }

                var url = await s3.CreateTempURLS3(AmazonS3Service.Bucket, key);

                user.Update(null, nickName: input.Nickname ?? user.Nickname, key,
                    activityLocation: input.ActivityLocation ?? null,
                    publicTimer: DateTime.Now.AddDays(2).AddHours(-3), avatarUrl: url, email: input.Email, null, null, null,
                    null, null, null);

                await _userManager.UpdateAsync(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                user.Update(null, nickName: input.Nickname ?? user.Nickname, null,
                    activityLocation: input.ActivityLocation ?? user.ActivityLocation, 
                    publicTimer: DateTime.Now.AddDays(2).AddHours(-3), null, null, null, null, null,
                    null, null, null);

                await _userManager.UpdateAsync(user);
                await _context.SaveChangesAsync();
            }

            return true;

        }

        public async Task<bool> ResetPassword(ResetPasswordInput input)
        {
            var user = await _userManager.FindByIdAsync(input.UserId);

            if (user == null)
            {
                return false;
            }

            var result = await _userManager.ResetPasswordAsync(user, input.Token, input.Password);

            if (result.Succeeded)
            {
                return true;
            }

            return false;
        }

        public async Task<ProfileInfoDto> GetProfile(string nickname, int userId)
        {
            var searchedUser = await _context.Users.Include(x => x.Photos)
                .Include(x => x.Medias).FirstOrDefaultAsync(x => x.Id == userId);

            if (searchedUser == null)
            {
                var band = await _context.Bands.FirstOrDefaultAsync(x => x.Id == Convert.ToInt32(userId));
                var bandUserId = await _context.BandsUsers.Where(x => x.BandId == band.Id && x.IsBand).Select(x => x.UserId).FirstOrDefaultAsync();

                searchedUser = await _context.Users.Include(x => x.Photos)
                    .Include(x => x.Medias).FirstOrDefaultAsync(x => x.Id == bandUserId);
            }
                
            var user = await _utils.GetUserAsync();

            if (searchedUser == null)
                throw new Exception("Não foi possivel encontrar o usuário selecionado");

            var searchedBand = await _context.BandsUsers.Include(bandUser => bandUser.Band)
                .Where(x => x.UserId == searchedUser.Id && x.IsBand)
                .Select(bandUser => bandUser.Band)
                .FirstOrDefaultAsync();

            List<User>? integrants = new List<User>();

            if (searchedBand != null)
            {
                integrants = await _context.BandsUsers.Include(x => x.User)
                    .Where(x => x.BandId == searchedBand.Id && !x.IsBand)
                    .Select(x => x.User)
                    .ToListAsync();
            }

            return new ProfileInfoDto
            {
                Name = searchedUser.Nickname,
                Banner = new BannerInfos
                {
                    Position = searchedUser.BannerPosition,
                    URL = searchedUser.BannerUrl
                },
                CityName = EnumHelper<EActivityLocation>.GetDisplayValue(searchedUser.ActivityLocation),
                AvatarUrl = searchedUser.AvatarUrl,
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
                    IntegrantsWithUrl = integrants?.Select(integrant => new IntegrantInfoDto
                    {
                        Name = integrant.Nickname,
                        Instrument = integrant.Instrument,
                        ProfileUrl = $"/profile/{integrant.Nickname}/{integrant.Id}",
                        AvatarUrl = integrant.AvatarUrl
                    }).ToList()
                },
                ProfileInfoPhotos = searchedUser?.Photos?.Select(photo => new ProfileInfoPhotoDto
                {
                    Id = photo.Id,
                    Title = photo.Title,
                    PhotoSrc = photo.PrivateURL
                }).ToList(),
                ProfileInfoVideos = searchedUser?.Medias?.Select(media => new ProfileInfoVideoDto
                {
                    Id = media.Id,
                    MediaSrc = media.Src,
                    Title = media.Title,
                }).ToList()
            };
        }

        public async Task<List<SearchBarUserDetailDto>> GetUsersForSearchBar(string nickname)
        {
            var user = await _utils.GetUserAsync();
            if (string.IsNullOrEmpty(nickname))
            {
                return new List<SearchBarUserDetailDto>();
            }

            var lowerSearchTerm = nickname.ToLower();

            var users = await _context.Users
                .Where(x => x.Id != user.Id)
                .Where(u => u.Nickname.ToLower().Contains(lowerSearchTerm) ||
                            u.Email.ToLower().Contains(lowerSearchTerm))
                .Take(10)
                .Select(u => new SearchBarUserDetailDto
                {
                    UserId = u.Id,
                    NickName = u.Nickname,
                    AvatarUrl = u.AvatarUrl
                })
                .ToListAsync();

            return users;
        }

        public async Task<bool> InviteMemberBand(InviteMemberInput input)
        {
            try
            {
                var user = await _utils.GetUserAsync();
                var band = await _context.BandsUsers
                            .Where(x => x.UserId == user.Id)
                            .Select(x => x.Band)
                            .FirstOrDefaultAsync();

                bool notificationExists = await _context.SystemNotifications
                                        .AnyAsync(n => n.UserId == input.UserInvited.UserId
                                        && n.SystemNotificationType == Enums.SystemNotification.ESystemNotificationType.Invite
                                        && n.Message.Contains(band.Name) && !n.IsRead && !n.IsDeleted);

                if (notificationExists)
                {
                    throw new Exception("Você já enviou um convite a esse usuário, aguarde a resposta do mesmo");
                }


                SystemNotification systemNotification = new SystemNotification("Convite para banda", $"Você foi convidado para tocar na banda {band.Name} como {input.Instrument}", Enums.SystemNotification.ESystemNotificationType.Invite);
                systemNotification.Update(systemNotification.Title, systemNotification.Message, systemNotification.SystemNotificationType, hiddenInfos: $"ID da Banda: {band.Id}", false, false);
                systemNotification.UserId = input.UserInvited.UserId;

                await _context.SystemNotifications.AddAsync(systemNotification);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<bool> AddMemberToBand(int notificationId)
        {
            var user = await _utils.GetUserAsync();
            var notification = _context.SystemNotifications.FirstOrDefault(x => x.Id == notificationId);
            var bandId = Convert.ToInt32(notification.HiddenInfos.Replace("ID da Banda:", "").Trim());
            string instrument = Regex.Match(notification.Message, @"como\s(.*)").Groups[1].Value;

            var band = await _context.BandsUsers.Include(x => x.Band).FirstOrDefaultAsync(x => x.BandId == bandId);

            if (band != null)
            {
                try
                {
                    await _context.BandsUsers.AddAsync(new BandsUsers
                    {
                        BandId = bandId,
                        UserId = user.Id
                    });

                    notification.Update(notification.Title, notification.Message, Enums.SystemNotification.ESystemNotificationType.Invite, notification.HiddenInfos, isRead: true, notification.IsDeleted);

                    user.Update(user.IsFirstTimeLogin, user.Nickname, user.AvatarKey, user.ActivityLocation, user.PublicTimerAvatar, user.AvatarUrl,
                        user.Email, bannerKey: user.BannerKey, bannerUrl: user.BannerUrl, null, null, instrument, null);

                    await _context.SaveChangesAsync(); return true;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }

            return false;
        }

        public async Task<bool> DeleteMemberInvite(string nickname)
        {
            var user = await _utils.GetUserAsync();
            var memberInvited = _context.Users.FirstOrDefault(x => x.Nickname == nickname);
            var band = await _context.BandsUsers.Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            try
            {
                var notification = await _context.SystemNotifications.FirstOrDefaultAsync(x => x.Message.Contains(band.Name) && x.UserId == memberInvited.Id);

                _context.SystemNotifications.Remove(notification);
                await _context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}