using AutoMapper;
using EntryAPI.Data;
using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Security.Claims;

namespace EntryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class AnalyticsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		public AnalyticsController(ApplicationDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}
		private int GetCurrentUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
		[HttpGet("recent/{days}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetRecentAnalyses(int days = 30)
		{
			var userId = GetCurrentUserId();
			var startDate = DateTime.UtcNow.AddDays(-days);

			var analyses = await _context.AIAnalyses
								.Include(a => a.Entry)
								.Where(a => a.UserId == userId && a.AnalyzedAt >= startDate)
								.OrderByDescending(a => a.AnalyzedAt)
								.ToListAsync();

			var result = _mapper.Map<List<AIAnalysisDTO>>(analyses);
			return Ok(result);
		}
		[HttpGet("weekly-stats")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		public async Task<IActionResult> GetWeeklyStats()
		{
			var userId = GetCurrentUserId();
			DateTime startOfWeek;
			var today = DateTime.UtcNow;
			var dayOfWeek = (int)today.DayOfWeek;
			if (dayOfWeek == 0) // Pazar ise
			{
				startOfWeek = today.AddDays(-6).Date; 
			}
			else // Diğer günler
			{
				startOfWeek = today.AddDays(-(dayOfWeek - 1)).Date; 
			}

		

			var analyses = await _context.AIAnalyses
				.Where(a => a.UserId == userId && a.AnalyzedAt >= startOfWeek)
				.ToListAsync();

			if(!analyses.Any())
			{
				return Ok(new { Message = "Bu hafta henüz analiz bulunmuyor" });
			}
	

			var stats = new
			{
				TotalEntries = analyses.Count(),
				AverageMoodIntensity = Math.Round(analyses.Average(a => a.MoodIntensity), 1),
				BestMoodDay = analyses.OrderByDescending(a => a.MoodIntensity).First().AnalyzedAt.ToString("dddd"),
				WorstMoodDay = analyses.OrderBy(a => a.MoodIntensity).First().AnalyzedAt.ToString("dddd"),
				MoodDistribution = analyses.GroupBy(a => a.Mood).ToDictionary(g => g.Key, g => g.Count()),
				EmotionDistribution = analyses
				.SelectMany(a => JsonConvert.DeserializeObject<List<string>>(a.DetectedEmotions) ?? new List<string>())
				.GroupBy(emotion => emotion)
				.ToDictionary(g => g.Key, g => g.Count()),
				DailyAverages = analyses.GroupBy(a => a.AnalyzedAt.Date)
										.OrderBy(g => g.Key)		
										.Select(g => new
										{
											Date = g.Key.ToString("dddd"),
											AverageMood = Math.Round(g.Average(a => a.MoodIntensity), 1),
											EntryCount = g.Count()
										})
										.ToList()
			};
			return Ok(stats);
		}
	}
}
