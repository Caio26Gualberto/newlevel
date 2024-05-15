using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;

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
            AwsKeyId = Environment.GetEnvironmentVariable("AwsKeyId")!;
            AwsKeySecret = Environment.GetEnvironmentVariable("AwsKeySecret")!;
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
    }
}
