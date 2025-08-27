using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.SystemNotification;
using NewLevel.Application.Interfaces.User;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.SystemNotification;
using NewLevel.Shared.DTOs.SystemNotifications;
using System.Text.RegularExpressions;

namespace NewLevel.Application.Services.SystemNotifications
{
    public class SystemNotificationService : ISystemNotificationService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IRepository<SystemNotification> _repository;
        private readonly IRepository<BandsUsers> _bandUsers;
        private readonly IUserService _userService;
        private readonly AmazonS3Service _s3Service;
        public SystemNotificationService(IServiceProvider serviceProvider, IRepository<SystemNotification> repository, IUserService userService, 
            IRepository<BandsUsers> bandUsers, AmazonS3Service s3Service)
        {
            _serviceProvider = serviceProvider;
            _repository = repository;
            _userService = userService;
            _bandUsers = bandUsers;
            _s3Service = s3Service;
        }

        public async Task<bool> AcceptInvite(int notificationId)
        {
            return await _userService.AddMemberToBand(notificationId);
        }

        public async Task<List<PendingInvitesDto>> GetPendingInvitations()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var band = await _bandUsers.GetAll().Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();

            var notificationsFromDb = await _repository.GetAll()
                .Include(x => x.User)
                .Where(x => x.Message.Contains(band.Name))
                .Where(x => !x.IsDeleted && !x.IsRead)
                .ToListAsync();

            var notifications = await Task.WhenAll(notificationsFromDb.Select(async x =>
            {
                var match = Regex.Match(x.Message, @"como\s(.*)");
                return new PendingInvitesDto
                {
                    NotificationId = x.Id,
                    Name = x.User.Nickname,
                    AvatarURL = await _s3Service.GetOrGenerateAvatarPrivateUrl(x.User),
                    Instrument = match.Success ? match.Groups[1].Value : string.Empty,
                };
            }));

            return notifications.ToList();
        }

        public async Task<bool> DeclineInvite(int notificationId)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            var notification = await _repository.FirstOrDefaultAsync(x => x.Id == notificationId);
            var bandId = Convert.ToInt32(notification!.HiddenInfos!.Replace("ID da Banda:", "").Trim());
            var bandUser = await _bandUsers.GetAll().Include(x => x.User).Where(x => x.BandId == bandId).Select(x => x.User).FirstOrDefaultAsync();

            if (notification != null)
            {
                notification.IsRead = true;
                SystemNotification newNotification = new SystemNotification
                {
                    Title = "Convite recusado",
                    Message = $"{user.Nickname} recusou seu convite para tocar na banda",
                    SystemNotificationType = notification.SystemNotificationType,
                };
                newNotification.UserId = bandUser.Id;

                await _repository.AddAsync(newNotification);
                await _repository.UpdateAsync(notification);
                return true;
            }
            else
            {
                throw new Exception("Notificação não encontrada.");
            }
        }

        public async Task<GeneralNotificationInfoDto> GetAllNotificationByUser()
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);

            var notifications = await _repository.GetAll().Where(x => x.UserId == user.Id).Where(x => x.IsDeleted == false).ToListAsync();

            return new GeneralNotificationInfoDto
            {
                TotalCount = notifications.Count,
                Notifications = notifications.Select(x => new NotificationDto
                {
                    Id = x.Id,
                    Message = x.Message,
                    Title = x.Title,
                    CreatedDate = x.CreationTime,
                    NotificationType = x.SystemNotificationType
                }).ToList()
            };
        }

        public async Task<bool> DeleteNotification(int notificationId)
        {
            var notification = await _repository.FirstOrDefaultAsync(x => x.Id == notificationId);
            if (notification != null)
            {
                notification.IsDeleted = true;
                await _repository.UpdateAsync(notification);
                return true;
            }
            else
            {
                throw new Exception("Notificação não encontrada.");
            }
        }

        public async Task<bool> ReadNotification(int notificationId)
        {
            var notification = await _repository.FirstOrDefaultAsync(x => x.Id == notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await _repository.UpdateAsync(notification);
                return true;
            }
            else
            {
                throw new Exception("Notificação não encontrada.");
            }
        }
    }
}
