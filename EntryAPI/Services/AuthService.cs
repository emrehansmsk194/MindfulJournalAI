using EntryAPI.Data;
using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace EntryAPI.Services
{
	public class AuthService : IAuthService
	{
		private readonly ApplicationDbContext _context;
		private readonly IConfiguration _configuration;
		public AuthService(ApplicationDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}
		public string GenerateJwtToken(User user)
		{
			var jwtSettings = _configuration.GetSection("JwtConfig");
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
				new Claim("firstName", user.FirstName),
				new Claim("lastName", user.LastName)
			};

			var token = new JwtSecurityToken(
				issuer: jwtSettings["Issuer"],
				audience: jwtSettings["Audience"],
				claims: claims,
				expires: DateTime.UtcNow.AddDays(Convert.ToDouble(jwtSettings["ExpiryInDays"])),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO loginRequest)
		{
			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Email.ToLower() == loginRequest.Email);
			if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
			{
				throw new UnauthorizedAccessException("Invalid email or password");
			}
			var token = GenerateJwtToken(user);
			return new LoginResponseDTO
			{
				Token = token,
				Email = user.Email,
				FirstName = user.FirstName,
				LastName = user.LastName,
				ExpiresAt = DateTime.UtcNow.AddDays(7)
			};
		}

		public async Task<LoginResponseDTO> RegisterAsync(RegisterRequestDTO registerRequest)
		{
			if(await _context.Users.AnyAsync(u => u.Email.ToLower() == registerRequest.Email.ToLower()))
			{
				throw new InvalidOperationException("User with this email already exists.");
			}
			var user = new User
			{
				Email = registerRequest.Email,
				FirstName = registerRequest.FirstName,
				LastName = registerRequest.LastName,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password)
			};
			_context.Users.Add(user);
			await _context.SaveChangesAsync();
			var token = GenerateJwtToken(user);
			return new LoginResponseDTO
			{
				Token = token,
				Email = user.Email,
				FirstName = user.FirstName,
				LastName = user.LastName,
				ExpiresAt = DateTime.UtcNow.AddDays(7)
			};
		}
	}
}
