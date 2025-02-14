namespace NewLevel.Entities
{
    public class BandsUsers
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public int BandId { get; set; }
        public Band Band { get; set; }
        public bool IsBand { get; set; }
    }
}
