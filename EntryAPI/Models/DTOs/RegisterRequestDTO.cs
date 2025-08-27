using System.ComponentModel.DataAnnotations;

namespace EntryAPI.Models.DTOs
{
	public class RegisterRequestDTO
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		[MinLength(6)]
		public string Password { get; set; }

		[Required]
		public string FirstName { get; set; }

		[Required]
		public string LastName { get; set; }
	}
}
