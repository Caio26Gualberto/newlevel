using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Azure.Core;

namespace NewLevel.Services.AmazonS3
{
    public class AmazonS3Service
    {
        public string AwsKeyId { get; private set; }
        public string AwsKeySecret { get; private set; }
        public BasicAWSCredentials AwsCredentials { get; private set; }

        private readonly IAmazonS3 _s3Client;

        public AmazonS3Service()
        {
            AwsKeyId = "";
            AwsKeySecret = "";
            AwsCredentials = new BasicAWSCredentials(AwsKeyId, AwsKeySecret);
            var config = new AmazonS3Config
            {
                RegionEndpoint = Amazon.RegionEndpoint.USEast2
            };
            _s3Client = new AmazonS3Client(AwsCredentials, config);
        }

        public async Task<bool> UploadFilesAsync(string bucket, string key, IFormFile file)
        {
            using var newMemoryStream = new MemoryStream();
            file.CopyTo(newMemoryStream);

            var fileTransferUtility = new TransferUtility(_s3Client); 

            await fileTransferUtility.UploadAsync(new TransferUtilityUploadRequest
            {
                InputStream = newMemoryStream,
                Key = key,            
                BucketName = bucket,
                ContentType = file.ContentType,
            });

            return true;
        }

        public async Task<bool> DeleteFileAsync(string bucket, string key)
        {
            var result = await _s3Client.DeleteObjectAsync(bucket, key);
            return result.HttpStatusCode == System.Net.HttpStatusCode.OK;
        }

        public async Task<string> CreateTempURLS3(string bucket, string key)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucket,
                Key = key,
                Expires = DateTime.Now.AddDays(2).AddHours(-3),
            };

            var url = _s3Client.GetPreSignedURL(request);

            return url;
        }
    }
}
