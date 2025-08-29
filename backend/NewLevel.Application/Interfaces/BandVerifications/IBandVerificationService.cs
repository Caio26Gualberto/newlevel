using NewLevel.Shared.DTOs.BandVerificationRequests;

namespace NewLevel.Application.Interfaces.BandVerificationRequests
{
    public interface IBandVerificationService
    {
        public Task<bool> CreateRequest(BandVerificationInput input);

    }
}
