using System.ComponentModel.DataAnnotations;

namespace NewLevel.Application.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(50, ErrorMessage = "Nome deve ter no máximo 50 caracteres")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Sobrenome é obrigatório")]
    [StringLength(50, ErrorMessage = "Sobrenome deve ter no máximo 50 caracteres")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Senha deve ter entre 6 e 100 caracteres")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
    [Compare("Password", ErrorMessage = "Senhas não coincidem")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
