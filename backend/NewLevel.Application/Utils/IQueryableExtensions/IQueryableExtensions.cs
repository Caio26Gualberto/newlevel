using System.Linq.Expressions;

namespace NewLevel.Application.Utils.IQueryableExtensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> WhereIf<T>(
            this IQueryable<T> query,
            bool condition,
            Expression<Func<T, bool>> predicate)
        {
            if (condition)
            {
                return query.Where(predicate);
            }

            return query;
        }
    }
}
