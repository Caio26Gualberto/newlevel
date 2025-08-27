﻿namespace NewLevel.Shared.DTOs.Medias
{
    public class MediaDto
    {
        public int? Id { get; set; }
        public string Src { get; set; }
        public string Title { get; set; }
        public string Nickname { get; set; }
        public string Description { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
