using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using NewLevel.Application.DTOs.Auth;
using NewLevel.Application.Services;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace NewLevel.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        ITokenService tokenService,
        IEmailService emailService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedAccessException("Credenciais inválidas");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!result.Succeeded)
        {
            throw new UnauthorizedAccessException("Credenciais inválidas");
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Save refresh token
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // 7 days

        await _userManager.UpdateAsync(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"]!)),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName
            }
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Email já está em uso");
        }

        var user = new User
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            EmailConfirmed = true // For simplicity, auto-confirm emails
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Erro ao criar usuário: {errors}");
        }

        // Send welcome email
        await _emailService.SendWelcomeEmailAsync(user.Email, user.FirstName);

        // Auto login after registration
        return await LoginAsync(new LoginDto { Email = registerDto.Email, Password = registerDto.Password });
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto refreshTokenDto)
    {
        var principal = GetPrincipalFromExpiredToken(refreshTokenDto.RefreshToken);
        if (principal?.Identity?.Name == null)
        {
            throw new UnauthorizedAccessException("Token inválido");
        }

        var user = await _userManager.FindByEmailAsync(principal.Identity.Name);
        if (user == null || !await _tokenService.ValidateRefreshTokenAsync(refreshTokenDto.RefreshToken, user.Id))
        {
            throw new UnauthorizedAccessException("Token inválido");
        }

        var newAccessToken = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"]!)),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName
            }
        };
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
        if (user == null || !user.IsActive)
        {
            // Don't reveal if user exists for security
            return true;
        }

        var resetToken = GeneratePasswordResetToken();
        user.PasswordResetToken = resetToken;
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1); // 1 hour expiry

        await _userManager.UpdateAsync(user);

        var resetUrl = _configuration["AppSettings:FrontendUrl"] + "/reset-password";
        await _emailService.SendPasswordResetEmailAsync(user.Email!, resetToken, resetUrl);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
        if (user == null || 
            user.PasswordResetToken != resetPasswordDto.Token || 
            user.PasswordResetTokenExpiry <= DateTime.UtcNow)
        {
            throw new InvalidOperationException("Token de redefinição inválido ou expirado");
        }

        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetToken, resetPasswordDto.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Erro ao redefinir senha: {errors}");
        }

        // Clear reset token
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;
        await _userManager.UpdateAsync(user);

        return true;
    }

    public async Task<bool> LogoutAsync(string userId)
    {
        await _tokenService.RevokeRefreshTokenAsync(userId);
        return true;
    }

    private System.Security.Claims.ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        // For refresh token validation, we'll use a simple approach
        // In production, you might want to decode and validate the refresh token properly
        return null;
    }

    private string GeneratePasswordResetToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}
