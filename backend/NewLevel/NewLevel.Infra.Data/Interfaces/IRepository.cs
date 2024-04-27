namespace NewLevel.Infra.Data.Interfaces
{
    public interface IRepository<Entity>
    {
        public IQueryable<Entity> GetAll();
    }
}
