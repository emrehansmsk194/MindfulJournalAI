namespace EntryAPI.Models.DTOs
{
	public class LoginResponseDTO
	{
		public string Token { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public DateTime ExpiresAt { get; set; }

	}
}
