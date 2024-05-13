using NewLevel.Dtos.Authenticate;
using NewLevel.Dtos.Utils;

namespace NewLevel.Interfaces.Services.Common
{
    public interface ICommonService
    {
        public List<DisplayActivityLocationDto> GetDisplayActivityLocation();
    }
}
