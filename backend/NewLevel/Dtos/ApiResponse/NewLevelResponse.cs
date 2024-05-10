namespace NewLevel.Dtos.ApiResponse
{
    public class NewLevelResponse<T>
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
    }
}
