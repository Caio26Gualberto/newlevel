using Microsoft.EntityFrameworkCore;
using NewLevel.Application.Interfaces.Events;
using NewLevel.Application.Services.Amazon;
using NewLevel.Application.Utils.IQueryableExtensions;
using NewLevel.Application.Utils.UserUtils;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Enums.Event;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.Events;
using NewLevel.Shared.DTOs.Photos;
using NewLevel.Shared.DTOs.Utils;
using NewLevel.Shared.Enums.Amazon;

namespace NewLevel.Application.Services.Events
{
    public class EventService : IEventService
    {
        private readonly IRepository<Event> _repository;
        private readonly IServiceProvider _serviceProvider;
        private readonly AmazonS3Service _s3Service;
        public EventService(IRepository<Event> repository, IServiceProvider serviceProvider, AmazonS3Service amazonService)
        {
            _repository = repository;
            _serviceProvider = serviceProvider;
            _s3Service = amazonService;
        }

        public async Task<bool> CreateEvent(CreateEventInput input)
        {
            var user = await UserUtils.GetCurrentUserAsync(_serviceProvider);
            string bannerUrl = string.Empty;
            string bannerKey = string.Empty;
            bool havebanner = false;

            if (input.Banner != null)
            {
                bannerKey = _s3Service.CreateKey(EAmazonFolderType.Banner, user.Id.ToString());
                var result = await _s3Service.UploadFilesAsync(bannerKey, input.Banner, EAmazonFolderType.Banner);
                var url = await _s3Service.CreateTempURLS3(bannerKey, EAmazonFolderType.Banner);
                bannerUrl = url;
                havebanner = true;
            }

            var newEvent = new Event
            {
                Title = input.Title,
                Description = input.Description,
                Location = input.Location,
                DateStart = input.StartTime,
                DateEnd = input.EndTime,
                Price = input.Price,
                Capacity = input.Capacity,
                TicketsLink = input.TicketLink,
                Genre = input.Genres,
                BannerKey = havebanner ? bannerKey : null,
                BannerPosition = havebanner ? input.BannerPosition : null,
                Photos = new List<Photo>(),
                Bands = new List<Band>(),
                OrganizerId = user.Id,
                EventStatus = EEventStatus.PendingApproval
            };

            if (input.Photos != null && input.Photos.Count > 0)
            {
                foreach (var photo in input.Photos)
                {
                    var key = _s3Service.CreateKey(EAmazonFolderType.Photo, user.Id.ToString());
                    await _s3Service.UploadFilesAsync(key, photo, EAmazonFolderType.Photo);

                    newEvent.Photos.Add(new Photo
                    {
                        KeyS3 = key,
                        Title = input.Title,
                        Subtitle = input.Title,
                        Description = input.Description ?? "Foto do evento",
                        CaptureDate = DateTime.Now.AddHours(-3)
                    });
                }
            }
            await _repository.AddAsync(newEvent);

            return true;
        }

        public async Task<GenericList<EventResponseDto>> GetAllEvents(Pagination input)
        {
            var allEvents = await _repository.GetAll()
                .ToListAsync();

            var skip = (input.Page - 1) * input.PageSize;

            var events = await _repository.GetAll()
                .Include(x => x.Organizer)
                .Include(x => x.Photos)
                .WhereIf(!string.IsNullOrEmpty(input.Search), photo => photo.Title.ToLower().Contains(input.Search!.ToLower()) || photo.Title.ToLower() == input.Search.ToLower())
                .OrderByDescending(photo => photo.CreationTime)
                .Skip(skip)
                .Take(input.PageSize)
                .ToListAsync();

            int totalPhotos = events.Count;
            List<EventResponseDto> eventDtos = new List<EventResponseDto>();

            if (allEvents != null && allEvents.Count > 0)
            {
                foreach (var ev in events)
                {
                    List<PhotoResponseDto> photos = new();

                    if (ev.Photos != null && ev.Photos.Count > 0)
                    {
                        var photoTasks = ev.Photos.Select(async p => new PhotoResponseDto
                        {
                            Id = p.Id,
                            Src = await _s3Service.GetOrGeneratePhotoPrivateUrl(p),
                            Title = p.Title,
                            Subtitle = p.Subtitle,
                            CaptureDate = p.CaptureDate,
                            Nickname = p.User?.Nickname ?? "Usuário desconhecido",
                            Description = p.Description
                        });

                        photos = (await Task.WhenAll(photoTasks)).ToList();
                    }

                    eventDtos.Add(new EventResponseDto
                    {
                        Id = ev.Id,
                        Title = ev.Title,
                        Description = ev.Description,
                        Location = ev.Location,
                        DateStart = ev.DateStart,
                        DateEnd = ev.DateEnd,
                        Price = ev.Price,
                        Capacity = ev.Capacity,
                        TicketsLink = ev.TicketsLink,
                        Genre = ev.Genre,
                        BannerUrl = await _s3Service.GetOrGenerateBannerForEventPrivateUrl(ev),
                        BannerPosition = ev.BannerPosition,
                        OrganizerName = ev.Organizer != null ? ev.Organizer.Nickname : "Organizador não informado",
                        EventStatus = ev.EventStatus,
                        Photos = photos,
                        CommentsCount = ev.Comments.Count,
                    });
                }


                return new GenericList<EventResponseDto>
                {
                    Items = eventDtos,
                    TotalCount = totalPhotos
                };
            }

            return new GenericList<EventResponseDto>
            {
                Items = new List<EventResponseDto>(),
                TotalCount = 0
            };
        }
    }
}
