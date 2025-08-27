using NewLevel.Dtos.Common;
using NewLevel.Enums.GithubLabels;

namespace NewLevel.Interfaces.Services.Github
{
    public interface IGithubService
    {
        Task<string> CreateIssue(CreateGitIssueInput input);
    }
}
