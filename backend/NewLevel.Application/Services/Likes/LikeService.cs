using NewLevel.Application.Interfaces.Likes;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Likes;

namespace NewLevel.Application.Services.Likes
{
    public class LikeService : ILikeService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IRepository<Like> _repository;
        public LikeService(IServiceProvider serviceProvider, IRepository<Like> repository)
        {
            _serviceProvider = serviceProvider;
            _repository = repository;
        }

        public async Task<bool> Like(LikeInput input)
        {
            var user = UserUtils.GetCurrentUserAsync(_serviceProvider);

            var existingLike = await _repository.FirstOrDefaultAsync(x => x.UserId == user.Id && x.TargetId == input.TargetId && x.TargetType == input.TargetType);

            if (existingLike != null)
                await _repository.DeleteAsync(existingLike);

            await _repository.AddAsync(new Like
            {
                UserId = user.Id,
                TargetId = input.TargetId,
                TargetType = input.TargetType,
            });

            return true;
        }
    }
}
