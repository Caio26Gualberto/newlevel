using System.ComponentModel.DataAnnotations;

namespace NewLevel.Domain.Enums.User
{
    public enum EActivityLocation
    {
        [Display(Name = "Santo André")]
        SantoAndre = 0,

        [Display(Name = "São Bernardo")]
        SaoBernardo = 1,

        [Display(Name = "São Paulo")]
        SaoPaulo = 2,

        [Display(Name = "São Caetano")]
        SaoCaetano = 3,

        [Display(Name = "Diadema")]
        Diadema = 4,

        [Display(Name = "Maua")]
        Maua = 5,

        [Display(Name = "Ribeirão Pires")]
        RibeiraoPires = 6,

        [Display(Name = "Rio Grande da Serra")]
        RioGrandeDaSerra = 7,

        [Display(Name = "Outros")]
        Outro = 8
    }
}
