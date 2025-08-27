namespace EntryAPI.Models
{
	public class Entry
	{
		public int Id { get; set; }
		public string Content { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
		public int UserId { get; set; }
		public virtual User User { get; set; }
		public virtual AIAnalysis? AIAnalysis { get; set; }
	}
}
