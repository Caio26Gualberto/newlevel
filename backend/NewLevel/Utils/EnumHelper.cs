using System.ComponentModel.DataAnnotations;

namespace NewLevel.Utils
{
    public static class EnumHelper<T>
    {
        /// <summary>
        /// Obtém o valor de exibição associado ao valor do enum.
        /// </summary>
        /// <param name="value">O valor do enum para obter o valor de exibição.</param>
        /// <returns>O valor de exibição associado ao valor do enum. Se não houver um atributo de exibição, retorna o nome do valor do enum.</returns>
        public static string GetDisplayValue(T value)
        {
            var fieldInfo = value.GetType().GetField(value.ToString());

            var descriptionAttributes = fieldInfo.GetCustomAttributes(
                typeof(DisplayAttribute), false) as DisplayAttribute[];

            if (descriptionAttributes == null) return string.Empty;
            return (descriptionAttributes.Length > 0) ? descriptionAttributes[0].Name : value.ToString();
        }

        /// <summary>
        /// Obtém uma lista de valores de exibição para uma lista de enums.
        /// </summary>
        /// <param name="values">A lista de valores do enum.</param>
        /// <returns>Uma lista de strings com os valores de exibição dos enums.</returns>
        public static List<string> GetDisplayValues(IEnumerable<T> values)
        {
            return values.Select(value => GetDisplayValue(value)).ToList();
        }
    }
}
