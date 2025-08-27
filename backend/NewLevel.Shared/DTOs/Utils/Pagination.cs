namespace NewLevel.Shared.DTOs.Utils
{
    public class Pagination
    {
        private int _page = 1;
        private int _pageSize = 10;

        /// <summary>
        /// Página atual (mínimo = 1).
        /// </summary>
        public int Page
        {
            get => _page;
            set => _page = value < 1 ? 1 : value;
        }

        /// <summary>
        /// Quantidade de itens por página (mínimo = 10).
        /// </summary>
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value < 1 ? 10 : value;
        }

        /// <summary>
        /// Quantidade total de itens retornados pela consulta.
        /// </summary>
        public int TotalItems { get; set; }

        /// <summary>
        /// Total de páginas (calculado automaticamente).
        /// </summary>
        public int PageCount
        {
            get => TotalItems == 0 ? 0 : (int)Math.Ceiling(TotalItems / (double)PageSize);
            set { /* setter vazio para bind do front, mas ignorado no cálculo */ }
        }

        /// <summary>
        /// Texto de busca opcional.
        /// </summary>
        public string? Search { get; set; }
    }

}
