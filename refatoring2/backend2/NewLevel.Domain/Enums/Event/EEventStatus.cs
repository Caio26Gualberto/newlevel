using System.ComponentModel.DataAnnotations;

namespace NewLevel.Domain.Enums.Event
{
    public enum EEventStatus
    {
        [Display(Name = "Pendente")]
        PendingApproval = 0,

        [Display(Name = "Aprovado")]
        Approved = 1,

        [Display(Name = "Rejeitado")]
        Rejected = 2,

        [Display(Name = "Cancelado")]
        Cancelled = 3
    }
}
