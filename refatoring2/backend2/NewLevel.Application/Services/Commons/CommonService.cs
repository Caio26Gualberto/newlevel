using NewLevel.Application.Interfaces.Commons;
using NewLevel.Shared.DTOs.Commons;
using System.ComponentModel.DataAnnotations;

namespace NewLevel.Application.Services.Commons
{
    public class CommonService : ICommonService
    {
        public List<SelectOptionDto> GetDisplayOptions<TEnum>() where TEnum : Enum
        {
            var displayList = new List<SelectOptionDto>();
            TEnum[] options = (TEnum[])Enum.GetValues(typeof(TEnum));

            foreach (var option in options)
            {
                var displayName = option.GetType()
                    .GetMember(option.ToString())[0]
                    .GetCustomAttributes(typeof(DisplayAttribute), false)
                    .Cast<DisplayAttribute>()
                    .FirstOrDefault()?.Name ?? option.ToString();

                displayList.Add(new SelectOptionDto
                {
                    Name = displayName,
                    Value = Convert.ToInt32(option)
                });
            }

            return displayList;
        }
    }
}
