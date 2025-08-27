using System.ComponentModel.DataAnnotations;

namespace NewLevel.Enums.GithubLabels
{
    public enum EGitLabels
    {
        [Display(Name = "Bug")]
        Bug = 1,
        [Display(Name = "Sugestão")]
        Sugestion = 2,
        [Display(Name = "Dispositivo Celular")]
        Mobile = 3,
        [Display(Name = "Dispositivo Desktop")]
        Desktop = 4,
    }
}
