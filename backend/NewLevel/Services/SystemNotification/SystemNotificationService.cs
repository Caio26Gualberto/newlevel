using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.SystemNotification;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.SystemNotification;
using NewLevel.Interfaces.Services.User;
using System.Text.RegularExpressions;

namespace NewLevel.Services.SystemNotificationService
{
    public class SystemNotificationService : ISystemNotificationService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly NewLevel.Utils.Utils _utils;
        private readonly NewLevelDbContext _context;
        private readonly IUserService _userService;

        public SystemNotificationService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, NewLevelDbContext context, IUserService userService)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _utils = new Utils.Utils(httpContextAccessor, userManager);
            _context = context;
            _userService = userService;
        }

        public async Task<bool> AcceptInvite(int notificationId)
        {
            return await _userService.AddMemberToBand(notificationId);
        }

        public async Task<bool> DeclineInvite(int notificationId)
        {
            var user = await _utils.GetUserAsync();
            var notification = await _context.SystemNotifications.FirstOrDefaultAsync(x => x.Id == notificationId);
            var bandId = Convert.ToInt32(notification.HiddenInfos.Replace("ID da Banda:", "").Trim());
            var bandUser = await _context.BandsUsers.Include(x => x.User).Where(x => x.BandId == bandId).Select(x => x.User).FirstOrDefaultAsync();

            if (notification != null)
            {
                notification.Update(notification.Title, notification.Message, notification.SystemNotificationType, notification.HiddenInfos, isRead: true, isDeleted: false);

                SystemNotification newNotification = new SystemNotification("Convite recusado", $"{user.Nickname} recusou seu convite para tocar na banda", notification.SystemNotificationType);
                newNotification.UserId = bandUser.Id;

                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                throw new Exception("Notificação não encontrada.");
            }
        }

        public async Task<bool> DeleteNotification(int notificationId)
        {
            var notification = await _context.SystemNotifications.FirstOrDefaultAsync(x => x.Id == notificationId);
            if (notification != null)
            {
                notification.Update(notification.Title, notification.Message, notification.SystemNotificationType, notification.HiddenInfos, notification.IsRead, isDeleted: true);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                throw new Exception("Notificação não encontrada.");
            }
        }

        public async Task<GeneralNotificationInfoDto> GetAllNotificationByUser()
        {
            var user = await _utils.GetUserAsync();

            var notifications = await _context.SystemNotifications.Where(x => x.UserId == user.Id).Where(x => x.IsDeleted == false).ToListAsync();

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

        public async Task<List<PendingInvitesDto>> GetPendingInvitations()
        {
            var user = await _utils.GetUserAsync();
            var band = await _context.BandsUsers.Include(x => x.Band).Where(x => x.UserId == user.Id).Select(x => x.Band).FirstOrDefaultAsync();
            var notifications = await _context.SystemNotifications
                .Include(x => x.User)
                .Where(x => x.Message.Contains(band.Name))
                .Where(x => x.IsDeleted == false && x.IsRead == false).ToListAsync();

            return notifications.Select(x => new PendingInvitesDto
            {
                NotificationId = x.Id,
                Name = x.User.Nickname,
                AvatarURL = x.User.AvatarUrl,
                Instrument = Regex.Match(x.Message, @"como\s(.*)").Groups[1].Value,
            }).ToList();
        }

        public async Task<bool> ReadNotification(int notificationId)
        {
            var notification = await _context.SystemNotifications.FirstOrDefaultAsync(x => x.Id == notificationId);
            if (notification != null)
            {
                notification.Update(notification.Title, notification.Message, notification.SystemNotificationType, notification.HiddenInfos, isRead: true, notification.IsDeleted);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                throw new Exception("Notificação não encontrada.");
            }
        }
    }
}
