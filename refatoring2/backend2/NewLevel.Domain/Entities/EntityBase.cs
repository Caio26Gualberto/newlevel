namespace NewLevel.Domain.Entities
{
    //TODO Dependendo da localidade do deploy da maquina verificar o fuso horario
    public class EntityBase
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreationTime { get; set; } = DateTime.UtcNow.AddHours(-3);
        public DateTime? UpdatedAt { get; set; }
    }
}
