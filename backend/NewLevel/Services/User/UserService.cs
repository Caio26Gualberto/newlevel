﻿using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.User;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.Email;
using NewLevel.Interfaces.Services.Photo;
using NewLevel.Interfaces.Services.User;
using NewLevel.Services.AmazonS3;
using System.ComponentModel.DataAnnotations;

namespace NewLevel.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly NewLevelDbContext _newLevelDbContext;
        private readonly NewLevel.Utils.Utils _utils;
        public UserService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, IEmailService emailService, NewLevelDbContext newLevelDbContext)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _emailService = emailService;
            _newLevelDbContext = newLevelDbContext;
            _utils = new Utils.Utils(httpContextAccessor, userManager);
        }

        public async Task GenerateTokenToResetPasswordByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var (body, subject) = EmailService.MakeResetPasswordTemplate(token, user.Id);

            await _emailService.SendEmail(user.Email!, subject, body);
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
                ProfilePicture = await GetOrSetAvatarURL(user)
            };
        }

        private async Task<string> GetOrSetAvatarURL(User user)
        {
            if (user.PublicTimer == null || user.PublicTimer < DateTime.UtcNow.AddHours(-3))
            {
                AmazonS3Service s3 = new AmazonS3Service();
                string key = user.AvatarKey!;
                var url = await s3.CreateTempURLS3("newlevel-images", key);
                return url;
            }

            return user.AvatarUrl!;
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

                user.Update(isFirstTimeLogin: false, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatarKey: user.AvatarKey, publicTimer: user.PublicTimer,
                    avatarUrl: user.AvatarUrl, email: user.Email);

                await _userManager.UpdateAsync(user);
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

            await _emailService.SendEmail(user.Email!, subject, body);
        }

        public async Task<bool> UploadAvatarImage(UploadAvatarImageInput input)
        {
            var user = await _utils.GetUserAsync();

            AmazonS3Service s3 = new AmazonS3Service();
            string key = $"avatars/{user.Id}/{Guid.NewGuid()}";
            var result = await s3.UploadFilesAsync("newlevel-images", key, input.File);
            var url = await s3.CreateTempURLS3("newlevel-images", key);

            if (!result)
            {
                throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");
            }

            user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: user.Nickname, activityLocation: user.ActivityLocation, avatarKey: key,
                publicTimer: DateTime.Now.AddDays(2).AddHours(-3), avatarUrl: url, email: user.Email);

            await _userManager.UpdateAsync(user);
            await _newLevelDbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateUser(UpdateUserInput input)
        {
            User user = await _utils.GetUserAsync();
            AmazonS3Service s3 = new AmazonS3Service();
            string key = $"avatars/{user.Id}/{Guid.NewGuid()}";

            if (input.File != null)
            {
                var isUploaded = await s3.UploadFilesAsync("newlevel-images", key, input.File);

                if (!isUploaded)
                    throw new Exception("Erro ao adicionar imagem a nuvem, caso o problema persista entre em contato com o desenvolvedor");

                if (!string.IsNullOrEmpty(user.AvatarKey))
                {
                    var fileDeleted = await s3.DeleteFileAsync("newlevel-images", user.AvatarKey);
                    if (!fileDeleted)
                        throw new Exception("Erro ao deletar imagem antiga, caso o problema persista entre em contato com o desenvolvedor");
                }

                var url = await s3.CreateTempURLS3("newlevel-images", key);
                user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: input.Nickname ?? user.Nickname, activityLocation: input.ActivityLocation ?? user.ActivityLocation,
                    avatarKey: key, publicTimer: DateTime.Now.AddDays(2).AddHours(-3), avatarUrl: url, email: input.Email);

                await _userManager.UpdateAsync(user);
                await _newLevelDbContext.SaveChangesAsync();
            }
            else
            {
                user.Update(isFirstTimeLogin: user.IsFirstTimeLogin, nickName: input.Nickname ?? user.Nickname, activityLocation: input.ActivityLocation ?? user.ActivityLocation,
                    avatarKey: user.AvatarUrl, publicTimer: DateTime.Now.AddDays(2).AddHours(-3), avatarUrl: user.AvatarUrl, email: input.Email);

                await _userManager.UpdateAsync(user);
                await _newLevelDbContext.SaveChangesAsync();
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

        public async Task<ProfileInfoDto> GetProfile(string nickname, string userId)
        {
            var searchedUser = await _userManager.FindByIdAsync(userId);
            var user = await _utils.GetUserAsync();

            if (searchedUser == null)
                throw new Exception("Não foi possivel encontrar o usuário selecionado");

            var searchedBand = await _newLevelDbContext.BandsUsers.Include(bandUser => bandUser.Band)
                .Where(x => x.UserId == searchedUser.Id)
                .Select(bandUser => bandUser.Band)
                .FirstOrDefaultAsync();

            var integrants = await _newLevelDbContext.BandsUsers.Include(x => x.User)
                .Where(x => x.BandId == searchedBand.Id)
                .Select(x => x.User)
                .ToListAsync();

            var bandToRemove = await _newLevelDbContext.BandsUsers.Include(bandUser => bandUser.User)
                .Where(x => x.BandId == searchedBand.Id)
                .Select(bandUser => bandUser.User)
                .FirstOrDefaultAsync();

            integrants.Remove(bandToRemove);

            return new ProfileInfoDto
            {
                Name = searchedUser.Nickname,
                CityName = searchedUser.ActivityLocation.GetType()
                    .GetMember(searchedUser.ActivityLocation.ToString())[0]
                    .GetCustomAttributes(typeof(DisplayAttribute), false)
                    .Cast<DisplayAttribute>()
                    .FirstOrDefault()?.Name ?? searchedUser.ActivityLocation.ToString(),
                AvatarUrl = searchedUser.AvatarUrl,
                IsEnabledToEdit = user.Id == searchedUser.Id,
                Band = searchedBand == null ? null : new BandDto
                {
                    CreatedAt = searchedBand.CreatedAt,
                    Description = searchedBand.Description,
                    IsVerified = searchedBand.IsVerified,
                    MusicGenres = searchedBand.MusicGenres,
                    Integrants = searchedBand.Integrants,
                    IntegrantsWithUrl = integrants?.Select(integrant => new IntegrantInfoDto
                    {
                        Name = integrant.Nickname,
                        Instrument = integrant.Instrument,
                        ProfileUrl = $"http://localhost:3000/profile/{integrant.Nickname}/{integrant.Id}"
                    }).ToList()
                }
            };
        }

        public async Task<List<SearchBarUserDetailDto>> GetUsersForSearchBar(string nickname)
        {
            if (string.IsNullOrEmpty(nickname))
            {
                return new List<SearchBarUserDetailDto>();
            }

            var lowerSearchTerm = nickname.ToLower();

            var users = await _newLevelDbContext.Users
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
    }
}