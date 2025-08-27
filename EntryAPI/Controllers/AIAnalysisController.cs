using AutoMapper;
using EntryAPI.Data;
using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using EntryAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Security.Claims;

namespace EntryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class AIAnalysisController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly IClaudeAIService _claudeAIService;
		private readonly IMapper _mapper;
		public AIAnalysisController(ApplicationDbContext context, IClaudeAIService claudeAIService, IMapper mapper)
		{
			_context = context;
			_claudeAIService = claudeAIService;
			_mapper = mapper;
		}
		private int GetCurrentUserId()
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			return int.Parse(userIdClaim ?? "0");
		}
		[HttpPost("analyze/{entryId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status409Conflict)]
		public async Task<IActionResult> AnalyzeEntry(int entryId)
		{
			var currentUserId = GetCurrentUserId();
			var entry = await _context.Entries
									  .Where(u => u.UserId == currentUserId && u.Id == entryId)
									  .FirstOrDefaultAsync();

			if(entry == null)
			{
				return NotFound($"Entry with ID {entryId} not found.");
			}
			if (entry.AIAnalysis != null)
			{
				return Conflict("This entry has already been analyzed. Use PUT to update or GET to retrieve existing analysis.");
			}
			AIAnalysis analysis = new AIAnalysis
			{
				EntryId = entryId,
				UserId = currentUserId
			};
			try
			{
				var sentimentResult = await _claudeAIService.AnalyzeSentimentAsync(entry.Content);
				analysis.Mood = sentimentResult.Mood;
				analysis.MoodIntensity = sentimentResult.Intensity;
				analysis.DetectedEmotions = JsonConvert.SerializeObject(sentimentResult.Emotions);
				analysis.Summary = sentimentResult.Summary;
				analysis.IsSuccessful = true;

			}
			catch(Exception ex)
			{
				analysis.Mood = "nötr";
				analysis.MoodIntensity = 5;
				analysis.DetectedEmotions = JsonConvert.SerializeObject(new List<string> { "belirsiz" });
				analysis.Summary = "Analiz yapılamadı";
				analysis.IsSuccessful = false;
				analysis.ErrorMessage = ex.Message;
			}
			await _context.AIAnalyses.AddAsync(analysis);
			await _context.SaveChangesAsync();
			var result = _mapper.Map<AIAnalysisDTO>(analysis);
			return Ok(result);
			
		}
		[HttpGet("entry/{entryId}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]

		public async Task<IActionResult> GetAnalysisByEntry(int entryId)
		{
			var currentUserId = GetCurrentUserId();
			var entry = await _context.Entries
								.Include(e => e.AIAnalysis)
								.Where(e => e.Id == entryId && e.UserId == currentUserId)
								.FirstOrDefaultAsync();

			if (entry == null)
			{
				return NotFound($"Entry with ID {entryId} not found.");
			}

			if (entry.AIAnalysis == null)
			{
				return NotFound($"No analysis found for entry {entryId}");
			}
			var analysis = entry.AIAnalysis;
			var result = _mapper.Map<AIAnalysisDTO>(analysis);

			return Ok(result);

			
		}
		[HttpGet("user")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<List<AIAnalysisDTO>>> GetUserAnalyses()
		{
			var currentUserId = GetCurrentUserId();
			var analyses = await _context.AIAnalyses
				.Include(a => a.Entry)
				.Where(a => a.UserId == currentUserId)
				.OrderByDescending(a => a.AnalyzedAt)
				.ToListAsync();

			if(!analyses.Any())
			{
				return NotFound("Analyses not found!");
			}
			var result = _mapper.Map<List<AIAnalysisDTO>>(analyses);
			return Ok(result);
		}

	}
}
