using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NewLevel.Context;
using NewLevel.Dtos.SystemNotification;
using NewLevel.Entities;
using NewLevel.Interfaces.Services.SystemNotification;

namespace NewLevel.Services.SystemNotificationService
{
    public class SystemNotificationService : ISystemNotification
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<User> _userManager;
        private readonly NewLevel.Utils.Utils _utils;
        private readonly NewLevelDbContext _context;

        public SystemNotificationService(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager, NewLevelDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _utils = new Utils.Utils(httpContextAccessor, userManager);
            _context = context;
        }

        public async Task<GeneralNotificationInfoDto> GetAllNotificationByUser()
        {
            var user = await _utils.GetUserAsync();

            var notifications = await _context.SystemNotifications.Where(x => x.UserId == user.Id).ToListAsync();

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
    }
}
