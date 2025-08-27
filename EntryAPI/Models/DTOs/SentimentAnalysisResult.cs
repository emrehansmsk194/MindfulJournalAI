namespace EntryAPI.Models.DTOs
{
	public class SentimentAnalysisResult
	{
		public string Mood { get; set; }
		public int Intensity { get; set; }
		public List<String> Emotions { get; set; } = new List<string>();
		public string Summary { get; set; } = string.Empty;
	}
}
