namespace NewLevel.Dtos
{
    public class GenericList<T>
    {
        public int TotalCount { get; set; }
        public List<T> Items { get; set; }
    }
}
