namespace NewLevel.Shared.DTOs.Utils
{
    public class GenericList<T>
    {
        public int TotalCount { get; set; }
        public List<T> Items { get; set; }
    }
}
