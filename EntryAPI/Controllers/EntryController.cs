using AutoMapper;
using EntryAPI.Data;
using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EntryAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class EntryController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		public EntryController(ApplicationDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}
		private int GetCurrentUserId()
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			return int.Parse(userIdClaim ?? "0");
		}

		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<ActionResult> GetAllEntries()
		{
			try
			{
				var currentUserId = GetCurrentUserId();
				var entries = await _context.Entries
					.Where(e => e.UserId == currentUserId)
					.OrderByDescending(e => e.CreatedAt)
					.ToListAsync();
				return Ok(entries);
			}
			catch (Exception ex)
			{
				return NotFound("There are no entries yet!");
			}
		}
		[HttpGet("{id}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult> GetEntryById(int id)
		{
			var currentUserId = GetCurrentUserId();
			var entry = await _context.Entries
				.Where(e => e.Id == id && e.UserId == currentUserId)
				.FirstOrDefaultAsync();
			if(entry == null)
			{
				return NotFound($"Entry with ID {id} not found.");
			}
			return Ok(entry);
		}
		[HttpPost]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]

		public async Task<ActionResult> AddEntry(EntryDTO entryDTO)
		{
			if(entryDTO == null)
			{
				return BadRequest("Entry data is null.");
			}

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var currentUserId = GetCurrentUserId();
			Entry model = _mapper.Map<Entry>(entryDTO);
			model.UserId = currentUserId; 
			await _context.Entries.AddAsync(model);
			await _context.SaveChangesAsync();
			return Ok(model);
		}
		[HttpPut("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult> UpdateEntry([FromBody] EntryUpdateDTO entryUpdateDTO, int id)
		{
			if(entryUpdateDTO == null || id <= 0)
			{
				return BadRequest("Invalid entry data or ID.");
			}

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var currentUserId = GetCurrentUserId();
			var entry = await _context.Entries
									  .Where(e => e.Id == id && e.UserId == currentUserId)
									  .FirstOrDefaultAsync();
			if (entry == null)
			{
				return NotFound($"Entry with ID {id} not found.");
			}
			_mapper.Map(entryUpdateDTO, entry);
			entry.UpdatedAt = DateTime.UtcNow; // Update the timestamp
			await _context.SaveChangesAsync();
			return NoContent();

		}
		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult> DeleteEntry(int id)
		{
			var currentUserId = GetCurrentUserId();
			var entry = await _context.Entries
				.Where(e => e.Id == id && e.UserId == currentUserId)
				.FirstOrDefaultAsync();
			if (entry == null)
			{
				return NotFound($"Entry with ID {id} not found.");
			}
			_context.Entries.Remove(entry);
			await _context.SaveChangesAsync();
			return NoContent();
		}
	}
}
