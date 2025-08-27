using EntryAPI.Models;
using EntryAPI.Models.DTOs;

namespace EntryAPI.Services
{
	public interface IAuthService
	{
		Task<LoginResponseDTO> RegisterAsync(RegisterRequestDTO registerRequest);
		Task<LoginResponseDTO> LoginAsync(LoginRequestDTO loginRequestDTO);
		string GenerateJwtToken(User user);
	}
}
