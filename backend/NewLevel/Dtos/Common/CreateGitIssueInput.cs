using NewLevel.Enums.GithubLabels;

namespace NewLevel.Dtos.Common
{
    public class CreateGitIssueInput
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<EGitLabels> GitLabels { get; set; }
    }
}
