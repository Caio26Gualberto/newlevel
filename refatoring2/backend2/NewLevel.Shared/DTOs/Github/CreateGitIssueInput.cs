using NewLevel.Shared.Enums.Github;

namespace NewLevel.Shared.DTOs.Github
{
    public class CreateGitIssueInput
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<EGitLabels> GitLabels { get; set; }
    }
}
