using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces;
using NewLevel.Application.Services.Amazon;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Authenticate;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Auth;

namespace NewLevel.Application.Services.Auth
{
    public class AuthAppService
    {
        private readonly IAuthenticateService _authService;
        private readonly IEmailService _emailService;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<BandsUsers> _bandsUsersRepository;
        private readonly StorageService _s3Service;

        public AuthAppService(IAuthenticateService authenticateService, IEmailService emailService, IRepository<User> userRepository, 
            IRepository<BandsUsers> bandsUsersRepository, StorageService amazonS3Service)
        {
            _authService = authenticateService;
            _emailService = emailService;
            _userRepository = userRepository;
            _bandsUsersRepository = bandsUsersRepository;
            _s3Service = amazonS3Service;
        }

        public async Task<bool> ConfirmEmail(string userId, string token)
        {
            return await _authService.ConfirmEmail(userId, token);
        }

        public async Task<LoginResponseDto> Authenticate(string email, string password)
        {
            var isAuthenticated = await _authService.Authenticate(email, password);
            
            if (!isAuthenticated)
            {
                return new LoginResponseDto
                {
                    IsSuccess = false,
                    Message = "Email ou senha inválidos",
                    Tokens = null
                };
            }

            var user = await _userRepository.FirstOrDefaultAsync(x => x.Email == email);

            // Generate JWT tokens
            var accessToken = await _authService.GenerateJwtToken(email, await _s3Service.GetOrGenerateAvatarPrivateUrl(user));
            var refreshToken = await _authService.GenerateRefreshToken();
            
            // Save refresh token
            await _authService.SaveRefreshToken(email, refreshToken);

            return new LoginResponseDto
            {
                IsSuccess = true,
                Message = "Login realizado com sucesso",
                Tokens = new TokensDto
                {
                    Token = accessToken,
                    RefreshToken = refreshToken,
                    SkipIntroduction = !user.IsFirstTimeLogin
                }
            };
        }

        public async Task<RegisterResponseDto> Register(RegisterInputDto input)
        {
            var (token, userId, email) = await _authService.RegisterUser(input.Email, input.Password, input.Nickname, input.ActivityLocation);

            //await _emailService.SendEmailVerificationRequest(token, userId, email); // TODO Descomentar em produção

            if (string.IsNullOrEmpty(token))
            {
                return new RegisterResponseDto
                {
                    Result = false,
                    Message = "Erro ao registrar usuário"
                };
            }

            return new RegisterResponseDto
            {
                Result = true,
                Message = "Usuário registrado com sucesso"
            };
        }

        public async Task<RegisterResponseDto> BandRegister(RegisterInputDto input)
        {
            var (token, bandId, email) = await _authService.BandRegister(input.Email, input.Password, input.Nickname, input.Description, input.CreatedAt, input.MusicGenres, input.Integrants, 
                input.ActivityLocation);

            //await _emailService.SendEmailVerificationRequest(token, bandId, email); // TODO Descomentar em produção

            return new RegisterResponseDto
            {
                BandId = bandId,
                Message = bandId > 0 ? "Banda registrada com sucesso" : "Erro ao registrar banda"
            };
        }

        public async Task<bool> Logout()
        {
            await _authService.Logout();
            return true;
        }

        public async Task<ForgotPasswordResponseDto> ForgotPassword(ForgotPasswordRequestDto request)
        {
            var token = await _authService.GeneratePasswordResetTokenAsync(request.Email);
            
            if (string.IsNullOrEmpty(token))
            {
                return new ForgotPasswordResponseDto
                {
                    IsSuccess = false,
                    Message = "Email não encontrado no sistema"
                };
            }

            // Enviar email com o token de recuperação
            var emailSent = await _emailService.SendPasswordResetEmailAsync(request.Email, token);
            
            if (!emailSent)
            {
                return new ForgotPasswordResponseDto
                {
                    IsSuccess = false,
                    Message = "Erro ao enviar email de recuperação. Tente novamente mais tarde."
                };
            }
            
            return new ForgotPasswordResponseDto
            {
                IsSuccess = true,
                Message = "Email de recuperação enviado com sucesso. Verifique sua caixa de entrada."
            };
        }

        public async Task<ResetPasswordResponseDto> ResetPassword(ResetPasswordRequestDto request)
        {
            var result = await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
            
            return new ResetPasswordResponseDto
            {
                IsSuccess = result,
                Message = result ? "Senha alterada com sucesso" : "Token inválido ou expirado"
            };
        }

        public async Task<TokensDto> RefreshTokens(string refreshToken)
        {
            // Validar refresh token
            var isValidRefreshToken = await _authService.ValidateRefreshToken(refreshToken);
            if (!isValidRefreshToken)
            {
                return new TokensDto { Token = string.Empty, RefreshToken = string.Empty };
            }

            // Buscar email pelo refresh token válido
            var email = await _authService.GetEmailFromRefreshToken(refreshToken);
            if (string.IsNullOrEmpty(email))
            {
                return new TokensDto { Token = string.Empty, RefreshToken = string.Empty };
            }

            var user = await _userRepository.FirstOrDefaultAsync(x => x.Email == email);
            // Revogar refresh token atual (token rotation)
            await _authService.RemoveRefreshToken(refreshToken);

            // Gerar novos tokens
            var newAccessToken = await _authService.GenerateJwtToken(email, await _s3Service.GetOrGenerateAvatarPrivateUrl(user));
            var newRefreshToken = await _authService.GenerateRefreshToken();
            
            // Salvar novo refresh token
            await _authService.SaveRefreshToken(email, newRefreshToken);

            return new TokensDto
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                SkipIntroduction = !await ShouldSkipIntroduction(email)
            };
        }

        private async Task<bool> ShouldSkipIntroduction(string email)
        {
            return await _userRepository.GetAll().Where(x => x.Email == email).Select(x => x.IsFirstTimeLogin).FirstOrDefaultAsync();
        }
    }
}
