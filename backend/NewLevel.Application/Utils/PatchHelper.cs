namespace NewLevel.Application.Utils
{
    public static class PatchHelper
    {
        /// <summary>
        /// Atualiza as propriedades simples de um objeto de destino com os valores não nulos
        /// de um objeto de origem. 
        /// Ignora propriedades de tipos complexos e coleções, para evitar alterações indesejadas.
        /// </summary>
        /// <typeparam name="TTarget">O tipo do objeto que será atualizado.</typeparam>
        /// <typeparam name="TSource">O tipo do objeto que contém os novos valores.</typeparam>
        /// <param name="target">Objeto de destino que será atualizado.</param>
        /// <param name="source">Objeto de origem com os valores a serem aplicados.</param>
        public static void Patch<TTarget, TSource>(TTarget target, TSource source)
        {
            var sourceProps = typeof(TSource).GetProperties();
            var targetProps = typeof(TTarget).GetProperties()
                .ToDictionary(p => p.Name);

            foreach (var sourceProp in sourceProps)
            {
                var value = sourceProp.GetValue(source);

                if (value != null && targetProps.TryGetValue(sourceProp.Name, out var targetProp))
                {
                    // Bloqueia listas e tipos complexos
                    if (typeof(System.Collections.IEnumerable).IsAssignableFrom(sourceProp.PropertyType)
                        && sourceProp.PropertyType != typeof(string))
                    {
                        continue; // Pula coleções (ex: List<Photo>, List<Band>)
                    }

                    if (sourceProp.PropertyType.IsClass
                        && sourceProp.PropertyType != typeof(string)
                        && sourceProp.PropertyType != typeof(DateTime)
                        && sourceProp.PropertyType != typeof(DateTime?))
                    {
                        continue; // Pula entidades complexas (ex: Organizer/User)
                    }

                    if (targetProp.CanWrite && targetProp.PropertyType.IsAssignableFrom(sourceProp.PropertyType))
                    {
                        targetProp.SetValue(target, value);
                    }
                }
            }
        }

    }

}
