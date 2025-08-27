using NewLevel.Dtos.Authenticate;
using NewLevel.Dtos.Utils;
using NewLevel.Enums;
using NewLevel.Enums.Authenticate;
using NewLevel.Enums.GithubLabels;
using NewLevel.Interfaces.Services.Common;
using System.ComponentModel.DataAnnotations;

namespace NewLevel.Services.Common
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
