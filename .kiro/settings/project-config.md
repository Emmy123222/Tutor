# TutorBot Project Configuration

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm 8+
- OpenAI API key

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Add your OpenAI API key
3. Run `npm install`
4. Start development server with `npm run dev`

### Project Structure
- `frontend/` - React components and pages
- `backend/` - API utilities and services  
- `pages/api/` - Next.js API routes
- `hooks/` - Kiro agent hooks
- `.kiro/` - Kiro configuration and specs

### Key Features
- AI-powered content generation
- Interactive flashcards with flip animations
- Quiz system with scoring
- PDF export functionality
- Responsive design

### Testing
- Unit tests with Jest
- API route testing with mocks
- Component testing setup
- Run tests with `npm test`

### Deployment
- Optimized for Vercel deployment
- Environment variables required:
  - `OPENAI_API_KEY`
  - `NEXT_PUBLIC_APP_URL`

## Kiro Integration

### Hooks Available
- `summarizeAndGeneratePDF.hook.ts` - Auto PDF generation
- `flashcardExport.hook.ts` - Export flashcards to various formats
- `auto-test-generation.hook.ts` - Generate tests for API routes

### Steering Rules
- `tutorbot-guidelines.md` - General development standards
- `ai-prompting-best-practices.md` - AI integration guidelines

### Specs
- `tutorbot-backend.md` - Backend API specification