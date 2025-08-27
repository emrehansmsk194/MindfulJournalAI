# Mindful Journal AI

AI-powered mental health journaling application that analyzes emotional patterns and provides personalized recommendations using Claude AI.

## Features

- **AI Sentiment Analysis**: Automatic mood detection and emotional intensity scoring (1-10)
- **Trend Visualization**: Weekly mood charts and statistical insights  
- **Smart Recommendations**: Personalized activity suggestions based on risk assessment
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Secure Authentication**: JWT-based user authentication system
- **Turkish Language Support**: Native Turkish sentiment analysis

## Tech Stack

**Frontend:**
- React 18 with Hooks
- React Router v6
- Recharts for data visualization
- Responsive CSS

**Backend:**
- .NET 9.0 Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- AutoMapper
- Claude AI Integration

## Screenshots
### Home Page
<img width="500" alt="Home Page Desktop" src="https://github.com/user-attachments/assets/4edf24af-ac8a-498f-b8b9-d9785601c245" />
<img width="500" alt="Home Page Mobile" src="https://github.com/user-attachments/assets/229074c8-c065-4d2c-a674-3612df91e4d7" />

### Entries
<img width="500" alt="Entries Desktop" src="https://github.com/user-attachments/assets/cd0aec59-0584-4065-b933-909890025a4c" />
<img width="500" alt="Entries Mobile" src="https://github.com/user-attachments/assets/e17cc819-8fa7-45b9-8c6e-594d59adf815" />

### Trends
<img width="500"  alt="Trends" src="https://github.com/user-attachments/assets/27a8345d-fbc8-4ee6-b00c-d682ec7e2420" />
<img width="500" alt="Trends" src="https://github.com/user-attachments/assets/6e71d852-eee4-4cdf-a4ca-78cdb5bd7f49" />

### Recommendations
<img width="500"  alt="Recommendations" src="https://github.com/user-attachments/assets/f6f9d4be-8020-4282-a448-f14fc69ce109" />
<img width="500"  alt="Recommendations" src="https://github.com/user-attachments/assets/03294572-590d-4ba8-af46-334a90bff094" />



## Getting Started

### Prerequisites
- .NET 9.0 SDK
- Node.js 18+
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/emrehansmsk194/MindfulJournalAI.git

```
2. Backend Setup
```bash
git clone https://github.com/emrehansmsk194/MindfulJournalAI.git
cd EntryAPI
dotnet restore
dotnet user-secrets set "ClaudeAI:ApiKey" "your-claude-api-key"
dotnet user-secrets set "JwtConfig:Key" "your-jwt-secret-key"
dotnet ef database update
dotnet run
```
3.Frontend Setup
```bash
cd Frontend
cd vite-project
npm install
npm run dev
```

## API Documentation

The API includes comprehensive Swagger documentation:
- **Swagger UI**: `https://localhost:7012/swagger`
- Interactive endpoint testing
- Authentication examples

### Authentication Flow

```bash
# Register new user
POST /api/auth/register
{
 "email": "user@example.com",
 "password": "password123",
 "firstName": "John",
 "lastName": "Doe"
}

# Login and receive JWT token
POST /api/auth/login
{
 "email": "user@example.com", 
 "password": "password123"
}
```
## Architecture

### Backend Design
- **Clean Architecture**: Controller-Service pattern with dependency injection
- **DTO Pattern**: Secure data transformation and API contracts  
- **JWT Authentication**: Stateless authentication with configurable expiry
- **Error Handling**: Graceful degradation with fallback responses
- **Entity Framework**: Code-first approach with PostgreSQL

### Frontend Design
- **Component Architecture**: Reusable React components with hooks
- **Responsive Design**: Mobile-first CSS with breakpoints at 320px, 480px, 768px, 1024px
- **State Management**: React useState and useEffect for local state
- **API Integration**: Centralized API client with JWT token management

### AI Integration
- **Claude AI Service**: Sentiment analysis with Turkish language support
- **Risk Assessment**: Algorithm-based scoring for personalized recommendations
- **Fallback Mechanism**: Default responses when AI service is unavailable

## Environment Variables

### Development Setup
Create user secrets for local development:
```bash
dotnet user-secrets init
dotnet user-secrets set "ClaudeAI:ApiKey" "your-claude-api-key"
dotnet user-secrets set "JwtConfig:Key" "your-jwt-secret-key"
```
### Contributing

- Fork the repository
- Create a feature branch (git checkout -b feature/new-feature)
- Commit changes (git commit -m 'Add new feature')
- Push to branch (git push origin feature/new-feature)
- Open a Pull Request
