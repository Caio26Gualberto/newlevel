namespace NewLevel.Shared.DTOs.BandVerificationRequests
{
    public class BandVerificationInput
    {
        public string BandName { get; set; } = null!;
        public string ResponsibleName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Message { get; set; } = null!;
        public int BandId { get; set; }
    }
}
