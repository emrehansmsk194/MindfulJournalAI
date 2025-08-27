namespace EntryAPI.Models.DTOs
{
	public class RecommendationUpdateDTO
	{
		public string Name { get; set; }
		public string ShortDescription { get; set; }
		public string LongDescription { get; set; }
		public int Time { get; set; } // dakika cinsinden
		public string SchedulingType { get; set; }
		public string Category { get; set; }
		public string TargetMood { get; set; }
		public string? VideoUrl { get; set; }
		public DateTime? Updated { get; set; }
	}
}
