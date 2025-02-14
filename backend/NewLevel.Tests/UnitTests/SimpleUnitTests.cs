using Microsoft.Extensions.Configuration;
using NewLevel.Services.Scrapping;

namespace NewLevel.Tests.UnitTests
{
    public class SimpleUnitTests
    {
        private readonly IConfiguration _configuration;
        public SimpleUnitTests()
        {
            _configuration = TestConfiguration.GetConfiguration();
        }

        [Theory]
        [InlineData("395.213.068-07", "26/06/2001")]
        public async void ShouldReturnCPFConsulting(string cpf, string birthday)
        {
            var cpfConsulting = new CPFConsultingService(_configuration);
            DateTime birthdayDt = Convert.ToDateTime(birthday);
            var result = await cpfConsulting.ConsultCPF(cpf, birthdayDt);

            Assert.NotEmpty(result);
        }
    }
}
