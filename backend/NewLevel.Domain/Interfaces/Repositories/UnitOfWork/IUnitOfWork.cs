using NewLevel.Domain.Interfaces.Repository;

namespace NewLevel.Domain.Interfaces.Repositories.UnitOfWork
{
    public interface IUnitOfWork
    {
        IRepository<T> Repository<T>() where T : class;
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
