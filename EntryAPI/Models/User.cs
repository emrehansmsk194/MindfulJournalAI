using System.ComponentModel.DataAnnotations;

namespace EntryAPI.Models
{
	public class User
	{
		public int Id { get; set; }

		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		public string PasswordHash { get; set; }

		[Required]
		public string FirstName { get; set; }

		[Required]
		public string LastName { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		// Navigation property
		public virtual ICollection<Entry> Entries { get; set; } = new List<Entry>();
		
	}
}
