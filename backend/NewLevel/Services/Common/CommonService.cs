using NewLevel.Dtos.Authenticate;
using NewLevel.Dtos.Utils;
using NewLevel.Enums.Authenticate;
using NewLevel.Interfaces.Services.Common;
using System.ComponentModel.DataAnnotations;

namespace NewLevel.Services.Common
{
    public class CommonService : ICommonService
    {
        public List<DisplayActivityLocationDto> GetDisplayActivityLocation()
        {
            var displayList = new List<DisplayActivityLocationDto>();
            EActivityLocation[] options = (EActivityLocation[])Enum.GetValues(typeof(EActivityLocation));

            foreach (var option in options)
            {
                var displayName = option.GetType()
                                    .GetMember(option.ToString())[0]
                                    .GetCustomAttributes(typeof(DisplayAttribute), false)
                                    .Length > 0
                                ? ((DisplayAttribute)option.GetType()
                                                               .GetMember(option.ToString())[0]
                                                               .GetCustomAttributes(typeof(DisplayAttribute), false)[0])
                                  .Name
                                : option.ToString();

                displayList.Add(new DisplayActivityLocationDto
                {
                    Name = displayName,
                    Value = (int)option
                });
            }

            return displayList;
        }
    }
}
