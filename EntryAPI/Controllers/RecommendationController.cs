using AutoMapper;
using EntryAPI.Data;
using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using EntryAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EntryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RecommendationController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		private readonly IRecommendationService _recommendationService;
		public RecommendationController(ApplicationDbContext context, IMapper mapper, IRecommendationService recommendationService)
		{
			_context = context;
			_mapper = mapper;
			_recommendationService = recommendationService;
		}
		private int GetCurrentUserId()
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			return int.Parse(userIdClaim ?? "0");
		}
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> GetRecommendations()
		{
			var recommendations = await _context.Recommendations.ToListAsync();
			if (!recommendations.Any())
			{
				return NotFound();
			}
			return Ok(recommendations);

		}
		[HttpGet("{category}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]

		public async Task<IActionResult> GetRecommendationByCategory(string category)
		{
			var recommendations = await _context.Recommendations.Where(u => u.Category == category).ToListAsync();
			if (!recommendations.Any())
			{
				return NotFound();
			}
			return Ok(recommendations);

		}

		[HttpPost]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]

		public async Task<IActionResult> AddRecommendation (RecommendationDTO recommendationDTO)
		{
			if(recommendationDTO == null)
			{
				return BadRequest("Entry data is null.");
			}
			var model = _mapper.Map<Recommendation>(recommendationDTO);
			await _context.Recommendations.AddAsync(model);
			await _context.SaveChangesAsync();
			return Ok(model);
		}
		[HttpPut]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]

		public async Task<IActionResult> UpdateRecommendation(int id, RecommendationUpdateDTO updateDTO)
		{
			var recommendation = _context.Recommendations.Where(u => u.Id == id).FirstOrDefault();
			if (recommendation == null)
			{
				return BadRequest("Recommendation not found!");
			}
			updateDTO.Updated = DateTime.UtcNow;
			_mapper.Map(updateDTO, recommendation);
			await _context.SaveChangesAsync();
			return NoContent();
			
		}
		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]

		public async Task<IActionResult> DeleteRecommendation(int id)
		{
			var recommendation = _context.Recommendations.Where(u => u.Id == id).FirstOrDefault();
			if (recommendation == null)
			{
				return BadRequest("Recommendation not found!");
			}
			_context.Recommendations.Remove(recommendation);
			await _context.SaveChangesAsync();
			return NoContent();

		}

		[HttpGet("target-mood")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]

		public async Task<ActionResult<List<RecommendationDTO>>> GetRecommendationsByTargetMood()
		{
			var userId = GetCurrentUserId();
			var recommendations = await _recommendationService.GetRecommendationsByTargetMoodAsync(userId);
			if (recommendations == null || !recommendations.Any())
			{
				return NotFound("No recommendations found for the target mood.");
			}
			return Ok(recommendations);
		}
		[HttpGet("personalized")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest | StatusCodes.Status404NotFound)]

		public async Task<ActionResult<List<RecommendationDTO>>> GetPersonalizedRecommendations()
		{
			var userId = GetCurrentUserId();
			var recommendations = await _recommendationService.GetPersonalizedRecommendationsAsync(userId);
			if (recommendations == null || !recommendations.Any())
			{
				return NotFound("No recommendations found.");
			}
			return Ok(recommendations);
		}




	}
}
