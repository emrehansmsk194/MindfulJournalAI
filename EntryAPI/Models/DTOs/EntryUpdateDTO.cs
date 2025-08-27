using System.ComponentModel.DataAnnotations;

namespace EntryAPI.Models.DTOs
{
	public class EntryUpdateDTO
	{
		[Required]
		[MinLength(50, ErrorMessage = "Günlüğünüz en az 50 karakter olmalıdır. Lütfen duygularınızı daha detaylı ifade edin.")]
		[MaxLength(5000, ErrorMessage = "Günlük en fazla 5000 karakter olabilir.")]
		public string Content { get; set; } = string.Empty;
		public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
	}
}
