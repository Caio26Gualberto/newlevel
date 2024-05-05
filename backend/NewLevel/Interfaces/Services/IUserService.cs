namespace NewLevel.Interfaces.Services
{
    public interface IUserService
    {
        public Task<bool> Delete();
        public Task SkipIntroduction();
    }
}
