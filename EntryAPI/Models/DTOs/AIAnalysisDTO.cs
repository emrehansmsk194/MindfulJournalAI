namespace EntryAPI.Models.DTOs
{
	public class AIAnalysisDTO
	{
		public int Id { get; set; }
		public int EntryId { get; set; }
		public string Mood { get; set; }
		public int MoodIntensity { get; set; }
		public List<string> DetectedEmotions { get; set; } = new List<string>();
		public string Summary { get; set; }
		public string AIModel { get; set; }
		public DateTime AnalyzedAt { get; set; }
		public bool IsSuccessful { get; set; }
		public string? ErrorMessage { get; set; }

		
		public string? EntryContent { get; set; }
		public DateTime? EntryCreatedAt { get; set; }
	}
}
