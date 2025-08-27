namespace NewLevel.Application.Utils
{
    public static class PatchHelper
    {
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
                    if (targetProp.CanWrite && targetProp.PropertyType.IsAssignableFrom(sourceProp.PropertyType))
                    {
                        targetProp.SetValue(target, value);
                    }
                }
            }
        }
    }

}
