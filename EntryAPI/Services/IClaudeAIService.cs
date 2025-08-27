using EntryAPI.Models.DTOs;

namespace EntryAPI.Services
{
	public interface IClaudeAIService
	{
		Task<SentimentAnalysisResult> AnalyzeSentimentAsync(string entryText);
	}
}
