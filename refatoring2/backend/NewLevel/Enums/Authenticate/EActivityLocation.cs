using System.ComponentModel.DataAnnotations;

namespace NewLevel.Enums.Authenticate
{
    public enum EActivityLocation
    {
        [Display(Name = "Santo André")]
        SantoAndre = 0,

        [Display(Name = "São Bernardo")]
        SaoBernardo = 1,

        [Display(Name = "São Caetano")]
        SaoCaetano = 2,

        [Display(Name = "Diadema")]
        Diadema = 3,

        [Display(Name = "Maua")]
        Maua = 4,

        [Display(Name = "Ribeirão Pires")]
        RibeiraoPires = 5,

        [Display(Name = "Rio Grande da Serra")]
        RioGrandeDaSerra = 6,

        [Display(Name = "Outros")]
        Outro = 7
    }
}
