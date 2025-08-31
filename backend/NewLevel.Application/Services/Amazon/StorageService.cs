using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using NewLevel.Application.Interfaces.Cache;
using NewLevel.Domain.Entities;
using NewLevel.Shared.Enums.Amazon;
using System.IO;

namespace NewLevel.Application.Services.Amazon
{
    public class StorageService
    {
        public static string Bucket = "newlevel-images";
        public static string AvatarKey = "avatars/_userId__guid_";
        public static string BannerKey = "banners/_userId__guid_";
        public static string EventBannerKey = "eventBanners_userId_/_guid_";
        public static string PhotoKey = "photos/_fileTitle__guid_";
        public static string PostPhotoKey = "postPhotos/_postId__guid_";
        public static string PostMediaKey = "postMedia/_postId__guid_";
        public static bool IsAWS = false;
        public string StorageKeyId { get; private set; }
        public string StorageKeySecret { get; private set; }
        public BasicAWSCredentials AwsCredentials { get; private set; }

        private readonly IAmazonS3 _s3Client;
        private readonly ICacheService _redisService;

        public StorageService(IConfiguration configuration, ICacheService cache)
        {
            StorageKeyId = configuration["Wasabi:AccessKeyId"]!;
            StorageKeySecret = configuration["Wasabi:SecretAccessKey"]!; ;
            AwsCredentials = new BasicAWSCredentials(StorageKeyId, StorageKeySecret);
            var config = new AmazonS3Config();

            if (IsAWS)
                config.RegionEndpoint = RegionEndpoint.USEast2; // Ohio
            else
            {
                config.ForcePathStyle = true;
                config.ServiceURL = "https://s3.us-east-2.wasabisys.com";
            }

            _s3Client = new AmazonS3Client(AwsCredentials, config);
            _redisService = cache;
        }

        public async Task<bool> UploadFilesAsync(string key, IFormFile file, EAmazonFolderType folderType)
        {
            using var newMemoryStream = new MemoryStream();
            file.CopyTo(newMemoryStream);

            var fileTransferUtility = new TransferUtility(_s3Client);

            await fileTransferUtility.UploadAsync(new TransferUtilityUploadRequest
            {
                InputStream = newMemoryStream,
                Key = key,
                BucketName = Bucket,
                ContentType = file.ContentType,
                DisableDefaultChecksumValidation = !IsAWS
            });

            return true;
        }

        public async Task<bool> DeleteFileAsync(string key, EAmazonFolderType folderType)
        {
            var result = await _s3Client.DeleteObjectAsync(Bucket, key);
            return result.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }

        public async Task<string> CreateTempURLS3(string key, EAmazonFolderType folderType)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = Bucket,
                Key = key,
                Expires = DateTime.Now.AddDays(2).AddHours(-3),
            };

            var url = _s3Client.GetPreSignedURL(request);

            return url;
        }

        public string CreateKey(EAmazonFolderType folderType, string key)
        {
            switch (folderType)
            {
                case EAmazonFolderType.Avatars:
                    return AvatarKey.Replace("_userId_", key).Replace("_guid_", Guid.NewGuid().ToString());
                case EAmazonFolderType.Photo:
                    return PhotoKey.Replace("_fileTitle_", key).Replace("_guid_", Guid.NewGuid().ToString());
                case EAmazonFolderType.Banner:
                    return BannerKey.Replace("_userId_", key).Replace("_guid_", Guid.NewGuid().ToString());
                case EAmazonFolderType.EventBanner:
                    return EventBannerKey.Replace("_userId_", key).Replace("_guid_", Guid.NewGuid().ToString());
                case EAmazonFolderType.PostPhoto:
                    return PostPhotoKey.Replace("_postId_", key).Replace("_guid_", Guid.NewGuid().ToString());
                case EAmazonFolderType.PostMedia:
                    return PostMediaKey.Replace("_postId_", key).Replace("_guid_", Guid.NewGuid().ToString());
                default:
                    throw new ArgumentOutOfRangeException(nameof(folderType), folderType, null);
            }
        }

        public async Task<string> GetOrGeneratePhotoPrivateUrl(Photo photo)
        {
            var cacheKey = $"user:{photo.KeyS3}:photo";

            var cachedUrl = await _redisService.GetAsync<string>(cacheKey);
            if (!string.IsNullOrEmpty(cachedUrl))
                return cachedUrl;

            // Não tem no cache -> gera nova
            var url = await CreateTempURLS3(photo.KeyS3, EAmazonFolderType.Photo);

            await _redisService.SetAsync(cacheKey, url, TimeSpan.FromDays(2));
            return url;
        }

        public async Task<string> GetOrGenerateAvatarPrivateUrl(User user)
        {
            if (string.IsNullOrEmpty(user.AvatarKey))
                return string.Empty;

            var cacheKey = $"user:{user.AvatarKey}:avatar";

            var cachedUrl = await _redisService.GetAsync<string>(cacheKey);
            if (!string.IsNullOrEmpty(cachedUrl))
                return cachedUrl;

            // Não tem no cache -> gera nova
            var url = await CreateTempURLS3(user.AvatarKey!, EAmazonFolderType.Avatars);

            await _redisService.SetAsync(cacheKey, url, TimeSpan.FromDays(2));
            return url;
        }

        public async Task<string> GetOrGenerateBannerPrivateUrl(User user)
        {
            if (string.IsNullOrEmpty(user.AvatarKey))
                return string.Empty;

            var cacheKey = $"user:{user.BannerKey}:banner";

            var cachedUrl = await _redisService.GetAsync<string>(cacheKey);
            if (!string.IsNullOrEmpty(cachedUrl))
                return cachedUrl;

            // Não tem no cache -> gera nova
            var url = await CreateTempURLS3(user.BannerKey!, EAmazonFolderType.Banner);

            await _redisService.SetAsync(cacheKey, url, TimeSpan.FromDays(2));
            return url;
        }

        public async Task<string> GetOrGenerateBannerForEventPrivateUrl(Event @event)
        {
            if (string.IsNullOrEmpty(@event.BannerKey))
                return string.Empty;

            var cacheKey = $"user:{@event.BannerKey}:eventBanner";

            var cachedUrl = await _redisService.GetAsync<string>(cacheKey);
            if (!string.IsNullOrEmpty(cachedUrl))
                return cachedUrl;

            // Não tem no cache -> gera nova
            var url = await CreateTempURLS3(@event.BannerKey!, EAmazonFolderType.EventBanner);

            await _redisService.SetAsync(cacheKey, url, TimeSpan.FromDays(2));
            return url;
        }

        public async Task<string> GetOrGenerateMediaPrivateUrl(Media media)
        {
            if (string.IsNullOrEmpty(media.KeyS3))
                return string.Empty;

            var cacheKey = $"user:{media.KeyS3}:postMedia";

            var cachedUrl = await _redisService.GetAsync<string>(cacheKey);
            if (!string.IsNullOrEmpty(cachedUrl))
                return cachedUrl;

            // Não tem no cache -> gera nova
            var url = await CreateTempURLS3(media.KeyS3!, EAmazonFolderType.PostMedia);

            await _redisService.SetAsync(cacheKey, url, TimeSpan.FromDays(2));
            return url;
        }
    }
}
