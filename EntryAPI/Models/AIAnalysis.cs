namespace EntryAPI.Models
{
	public class AIAnalysis
	{
		public int Id { get; set; }
		public int EntryId { get; set; }
		public int UserId { get; set; }
		public string Mood { get; set; } = string.Empty;
		public int MoodIntensity { get; set; }
		public string DetectedEmotions { get; set; } = string.Empty;
		public string Summary { get; set; } = string.Empty;
		public string AIModel { get; set; } = "claude-3-5-sonnet-20241022";
		public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
		public bool IsSuccessful { get; set; } = true;
		public string? ErrorMessage { get; set; } = string.Empty;

		public virtual Entry Entry { get; set; }
		public virtual User User { get; set; }


	}
}
