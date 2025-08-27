using System.ComponentModel.DataAnnotations;

namespace NewLevel.Domain.Enums.SystemNotification
{
    public enum ESystemNotificationType
    {
        [Display(Name = "Simples")]
        Simple = 0,
        [Display(Name = "Banner")]
        Banner = 1,
        [Display(Name = "Popup")]
        Popup = 2,
        [Display(Name = "Convite para Banda")]
        Invite = 3,
    }
}
