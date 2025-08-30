using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.Util.Store;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using NewLevel.Application.Interfaces.Youtube;

namespace NewLevel.Application.Services
{
    public class YoutubeService : IYoutubeService
    {
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _refreshToken;
        private static string _accessToken = string.Empty;

        public YoutubeService(IConfiguration configuration)
        {
            _clientId = configuration["Youtube:ClientId"]!;
            _clientSecret = configuration["Youtube:ClientSecret"]!;
            _refreshToken = configuration["Youtube:RefreshToken"]!;
        }

        public async Task<string> UploadVideoToYoutube(IFormFile video, string title, string description)
        {
            var credential = await GetCredentialAsync();

            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "NewLevel"
            });

            var videoSnippet = new Video
            {
                Snippet = new VideoSnippet
                {
                    Title = title,
                    Description = description
                },
                Status = new VideoStatus
                {
                    PrivacyStatus = "public" // public, unlisted ou private
                }
            };

            using var stream = video.OpenReadStream();

            var request = youtubeService.Videos.Insert(videoSnippet, "snippet,status", stream, "video/*");
            request.ProgressChanged += progress =>
            {
                Console.WriteLine(progress.Status + " " + progress.BytesSent);
            };

            request.ResponseReceived += response =>
            {
                Console.WriteLine($"Vídeo enviado com sucesso! VideoId: {response.Id}");
            };

            var uploadResult = await request.UploadAsync();

            if (uploadResult.Status == UploadStatus.Failed)
                throw new Exception($"Falha no upload: {uploadResult.Exception}");

            return request.ResponseBody.Id;
        }

        private async Task<UserCredential> GetCredentialAsync()
        {
            try
            {
                var token = new TokenResponse
                {
                    AccessToken = _accessToken,
                    RefreshToken = _refreshToken,
                    TokenType = "Bearer",
                    ExpiresInSeconds = 3600,
                };

                var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = _clientId,
                        ClientSecret = _clientSecret
                    },
                    Scopes = new[] { YouTubeService.Scope.YoutubeUpload },
                    DataStore = new NullDataStore()
                });

                var credential = new UserCredential(flow, "user", token);

                if (credential.Token.IsStale || string.IsNullOrEmpty(credential.Token.AccessToken))
                {
                    var success = await credential.RefreshTokenAsync(CancellationToken.None);

                    if (!success)
                    {
                        Console.WriteLine($"Refresh Token: {_refreshToken?.Substring(0, 10)}...");
                        Console.WriteLine($"Client ID: {_clientId?.Substring(0, 10)}...");
                        throw new Exception("Falha ao renovar token. Verifique se o refresh token ainda é válido.");
                    }

                    _accessToken = credential.Token.AccessToken;
                }

                return credential;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao obter credenciais: {ex.Message}", ex);
            }
        }
    }
}
