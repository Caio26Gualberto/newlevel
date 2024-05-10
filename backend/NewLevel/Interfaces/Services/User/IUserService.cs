namespace NewLevel.Interfaces.Services.User
{
    public interface IUserService
    {
        public Task<bool> Delete();
        public Task SkipIntroduction();
    }
}
