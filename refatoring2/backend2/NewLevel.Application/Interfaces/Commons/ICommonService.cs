using NewLevel.Shared.DTOs.Commons;

namespace NewLevel.Application.Interfaces.Commons
{
    public interface ICommonService
    {
        public List<SelectOptionDto> GetDisplayOptions<TEnum>() where TEnum : Enum;
    }
}
