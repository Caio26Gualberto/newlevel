namespace NewLevel.Domain.Entities
{
    public class BandVerificationRequest : EntityBase
    {
        public int Id { get; set; }
        public int BandId { get; set; }
        public Band Band { get; set; } = null!;

        public string ResponsibleName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Message { get; set; } = null!;
    }
}
