using NewLevel.Application.Interfaces;
using NewLevel.Application.Interfaces.BandVerificationRequests;
using NewLevel.Domain.Entities;
using NewLevel.Domain.Interfaces.Repository;
using NewLevel.Shared.DTOs.BandVerificationRequests;

namespace NewLevel.Application.Services.BandVerificationRequests
{
    public class BandVerificationService : IBandVerificationService
    {
        private readonly IRepository<BandVerificationRequest> _repository;
        private readonly IEmailService _emailService;
        public BandVerificationService(IRepository<BandVerificationRequest> repository, IEmailService emailService)
        {
            _repository = repository;
            _emailService = emailService;
        }

        public async Task<bool> CreateRequest(BandVerificationInput input)
        {
            var existingRequest = await _repository.FirstOrDefaultAsync(x => x.BandId == input.BandId);
            if (existingRequest != null)
            {
                throw new Exception("Já existe uma solicitação de verificação pendente para este usuário.");
            }

            var newRequest = new BandVerificationRequest
            {
                BandId = input.BandId,
                Email = input.Email,
                Message = input.Message,
                Phone = input.Phone,
                ResponsibleName = input.ResponsibleName,
            };
            await _repository.AddAsync(newRequest);

            await _emailService.SendBandVerificationRequest(input);
            return true;
        }
    }
}
