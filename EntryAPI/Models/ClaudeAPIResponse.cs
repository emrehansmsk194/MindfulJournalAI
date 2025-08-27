namespace EntryAPI.Models
{
	public class ClaudeAPIResponse
	{
		public string Id { get; set; }
		public string Type { get; set; }
		public string Role { get; set; }
		public List<ClaudeContent> Content { get; set; }
		public string Model { get; set; }
		public string StopReason { get; set; }
		public object Usage { get; set; }
	}

	public class ClaudeContent
	{
		public string Type { get; set; }
		public string Text { get; set; }
	}
}
