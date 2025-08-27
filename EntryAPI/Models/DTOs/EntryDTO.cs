using System.ComponentModel.DataAnnotations;

namespace EntryAPI.Models.DTOs
{
	public class EntryDTO
	{
		[Required]
		[MinLength(50, ErrorMessage ="Günlüğünüz en az 50 karakter olmalıdır. Lütfen duygularınızı daha detaylı ifade edin.")]
		[MaxLength(2500, ErrorMessage = "Günlük en fazla 2000 karakter olabilir.")]

		public string Content { get; set; } = string.Empty;
	}
}
