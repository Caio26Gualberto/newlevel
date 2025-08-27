using NewLevel.Shared.DTOs.Github;

namespace NewLevel.Application.Interfaces.Github
{
    public interface IGithubService
    {
        public Task<string> CreateIssue(CreateGitIssueInput input);
    }
}
