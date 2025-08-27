using AutoMapper;
using EntryAPI.Data;
using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;

namespace EntryAPI.Services
{
	public class RecommendationService : IRecommendationService
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		public RecommendationService(ApplicationDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;

		}
		public async Task<List<RecommendationDTO>> GetPersonalizedRecommendationsAsync(int userId)
		{
			var last7days = DateTime.UtcNow.AddDays(-7);
			var badMoods = new[] { "negatif", "üzgün", "kaygılı", "depresif" };
			var criticalEmotions = new[] { "stres", "kaygı", "üzgünlük", "panic", "depresyon" };
			int riskScore = 0;
			var recentAnalyses = await _context.AIAnalyses
				.Where(a => a.AnalyzedAt >= last7days && a.UserId == userId)
				.OrderByDescending(a => a.AnalyzedAt)
				.ToListAsync();
			foreach (var analysis in recentAnalyses)
			{
				var emotions = JsonConvert.DeserializeObject<List<string>>(analysis.DetectedEmotions);
				if (analysis.MoodIntensity >= 6 && badMoods.Contains(analysis.Mood) )
				{
					riskScore += 2;
				}
				else if (emotions != null && emotions.Any(e => criticalEmotions.Contains(e)))
				{
					riskScore += 1;
				}
			}
			if(riskScore >= 4)
			{
				var recommendations = await GetRecommendationsByType("acil");
				return recommendations;
			}
			else if(riskScore >= 2)
			{
				var recommendations = await GetRecommendationsByType("günlük");
				return recommendations;
			}
			else
			{
				var recommendations = await GetRecommendationsByType("haftalık");
				return recommendations;
			}

		}
		public async Task<List<RecommendationDTO>> GetRecommendationsByTargetMoodAsync(int userId)
		{
			var analyze = await _context.AIAnalyses.Where(a => a.UserId == userId).OrderByDescending(a => a.AnalyzedAt).FirstOrDefaultAsync();
			var emotions = JsonConvert.DeserializeObject<List<string>>(analyze.DetectedEmotions);
			foreach(var emotion in emotions)
			{
				Console.WriteLine(emotion);
			}
			if (analyze == null)
			{
				throw new Exception("No analysis found for the user.");
			}
			var targetMood = analyze.Mood;
			try
			{
				var recommendationsList = await _context.Recommendations
					.Where(r => emotions.Any(emotion => r.TargetMood.ToLower().Contains(emotion.Substring(0, Math.Min(4, emotion.Length)))))
					.ToListAsync();
				return _mapper.Map<List<RecommendationDTO>>(recommendationsList);
			}
			catch (Exception ex)
			{
				throw new Exception($"An error occurred while fetching recommendations for the target mood '{targetMood}'.", ex);
			}
		}
		public async Task<List<RecommendationDTO>> GetRecommendationsByType(string schedulingType)
		{
			try
			{
				var recommendations = await _context.Recommendations
										.Where(r => r.SchedulingType == schedulingType)
					                    .ToListAsync();
				return _mapper.Map<List<RecommendationDTO>>(recommendations);
			}
			catch (Exception ex)
			{
				throw new Exception($"An error occurred while fetching recommendations of type '{schedulingType}'.", ex);
			}
		}

		
	}
}
