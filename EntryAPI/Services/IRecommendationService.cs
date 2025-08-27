using EntryAPI.Models.DTOs;

namespace EntryAPI.Services
{
	public interface IRecommendationService
	{
		Task<List<RecommendationDTO>> GetRecommendationsByTargetMoodAsync(int userId);
		Task<List<RecommendationDTO>> GetPersonalizedRecommendationsAsync(int userId);
		Task<List<RecommendationDTO>> GetRecommendationsByType(string schedulingType);
	}
}
