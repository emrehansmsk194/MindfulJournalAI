using AutoMapper;
using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using Newtonsoft.Json;

namespace EntryAPI
{
	public class MappingConfig : Profile
	{
		public MappingConfig()
		{
			CreateMap<Entry, EntryDTO>().ReverseMap();
			CreateMap<Entry, EntryUpdateDTO>().ReverseMap();
			CreateMap<AIAnalysis, AIAnalysisDTO>()
			   .ForMember(dest => dest.DetectedEmotions, opt => opt.MapFrom(src =>
				   !string.IsNullOrEmpty(src.DetectedEmotions)
					   ? JsonConvert.DeserializeObject<List<string>>(src.DetectedEmotions)
					   : new List<string>()))
			   .ForMember(dest => dest.EntryContent, opt => opt.MapFrom(src => src.Entry.Content))
			   .ForMember(dest => dest.EntryCreatedAt, opt => opt.MapFrom(src => src.Entry.CreatedAt));
			CreateMap<Recommendation,RecommendationDTO>().ReverseMap();
			CreateMap<Recommendation,RecommendationUpdateDTO>().ReverseMap();
		}
		
	}
}
