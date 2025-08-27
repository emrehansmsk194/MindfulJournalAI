using EntryAPI.Models;
using EntryAPI.Models.DTOs;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Text;

namespace EntryAPI.Services
{
	public class ClaudeAIService : IClaudeAIService
	{
		private readonly HttpClient _httpClient;
		private readonly IConfiguration _configuration;
		private readonly string _apiKey;
		private readonly string _baseUrl = "https://api.anthropic.com/v1/messages";

		public ClaudeAIService(HttpClient httpClient, IConfiguration configuration)
		{
			_httpClient = httpClient;
			_configuration = configuration;
			_apiKey = _configuration["ClaudeAI:ApiKey"];
			if (string.IsNullOrEmpty(_apiKey))
			{
				throw new InvalidOperationException("Claude AI API key is not configured");
			}

			_httpClient.DefaultRequestHeaders.Add("x-api-key", _apiKey);
			_httpClient.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");
		}

		public async Task<SentimentAnalysisResult> AnalyzeSentimentAsync(string entryText)
		{
			try
			{
				var prompt = $@"
                Lütfen aşağıdaki Türkçe günlük metnini analiz et ve şu bilgileri ver:
                1. Genel mood/ruh hali (pozitif, negatif, nötr olarak)
                2. Duygu yoğunluğu (1-10 arası)
                3. Ana duygular (sevinç, üzüntü, öfke, korku, vs.)
                4. Kısa bir özet

                Günlük metni: ""{entryText}""

                Lütfen cevabını JSON formatında ver:
                {{
                    ""mood"": ""pozitif/negatif/nötr"",
                    ""intensity"": 1-10,
                    ""emotions"": [""duygu1"", ""duygu2""],
                    ""summary"": ""kısa özet""
                }} Bunun dışında herhangi bir gereksiz açıklamadan kaçın.";
				var requestBody = new
				{
					model = "claude-3-5-sonnet-20241022",
					messages = new[]
					{
						new
						{
							role = "user",
							content = prompt
						}
					},
					max_tokens = 1000
				};
				var json = JsonConvert.SerializeObject(requestBody);
				var content = new StringContent(json, Encoding.UTF8, "application/json");

				var response = await _httpClient.PostAsync(_baseUrl, content);
				if (!response.IsSuccessStatusCode)
				{
					var errorContent = await response.Content.ReadAsStringAsync();
					throw new Exception($"Error from Claude AI: {response.StatusCode} - {errorContent}");
				}
				var responseContent = await response.Content.ReadAsStringAsync();
				var claudeResponse = JsonConvert.DeserializeObject<ClaudeAPIResponse>(responseContent);
				var analysisJson = claudeResponse.Content[0].Text;
				var cleanJson = ExtractJsonFromResponse(analysisJson);
				var analysis = JsonConvert.DeserializeObject<SentimentAnalysisResult>(cleanJson);

				return analysis;

			}
			catch (Exception ex)
			{
				return new SentimentAnalysisResult
				{
					Mood = "nötr",
					Intensity = 5,
					Emotions = new List<string> { "belirsiz" },
					Summary = "Analiz yapılamadı"
				};
			}
		}

		private string ExtractJsonFromResponse(string response)
		{
			var startIndex = response.IndexOf('{');
			var endIndex = response.LastIndexOf('}');

			if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex)
			{
				return response.Substring(startIndex, endIndex - startIndex + 1);
			}

			return response;
		}
	}
}
