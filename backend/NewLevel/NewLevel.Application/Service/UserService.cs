using NewLevel.Shared.Interfaces.User;
using NewLevel.Shared.Service;

namespace NewLevel.Application.Service
{
    public class UserService : IUserService
    {
        private readonly UserIdInterceptor _userInterceptor;
        public UserService()
        {
            _userInterceptor = new UserIdInterceptor();
        }
        public bool SkipPresentation()
        {
            var userId = _userInterceptor.UserId;
            return true;
        }
    }
}
