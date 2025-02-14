using System.Net;
using System.Text;
using System.Text.Json;

namespace NewLevel.Services.Scrapping
{
    public class CPFConsultingService
    {
        private HttpClientHandler _handler;
        private HttpClient _client;
        private HttpResponseMessage _currentResponse;
        private string _currentResponseString => _currentResponse.Content.ReadAsStringAsync().Result;


        public async Task<string> CreateBillingPixAsync(string cpf, DateTime birthday)
        {
            using (_handler = new HttpClientHandler())
            {
                _handler.UseProxy = true;
                _handler.CookieContainer = new CookieContainer();
                _handler.AllowAutoRedirect = true;
                _handler.UseCookies = true;
                _handler.MaxConnectionsPerServer = 2;

                using (_client = new HttpClient(_handler, true))
                {
                    var requestData = new
                    {
                        calendario = new { expiracao = 3600 },
                        devedor = new { cpf = cpf, nome = "Nome qualquer" },
                        valor = new { original = "0.01" },
                        chave = "395.213.068-07",
                        infoAdicionais = new[]
                        {
                            new { nome = "Validação", valor = "Confirme seu CPF" }
                        }
                    };

                    var json = JsonSerializer.Serialize(requestData);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    HttpResponseMessage response = await _client.PostAsync("https://devportal.itau.com.br/api/pix/v2/cob", content);
                    string responseBody = await response.Content.ReadAsStringAsync();

                    var result = JsonSerializer.Deserialize<PixResponse>(responseBody);
                    return result?.pixCopiaECola;
                }
            }
        }

        public class PixResponse
        {
            public string pixCopiaECola { get; set; }
        }
    }
}
