# TutorBot - AI-Powered Educational Tutor 🧠

TutorBot is a production-ready educational web application that generates personalized learning modules using AI. Built with Next.js, TypeScript, and OpenAI's GPT models.

## ✨ Features

- **📚 Interactive Lessons**: Comprehensive explanations with real-world examples and code samples
- **🧠 Smart Quizzes**: AI-generated multiple choice and short answer questions with scoring
- **📇 Flip Flashcards**: Interactive cards for effective memorization
- **📄 PDF Export**: Professional summaries with AI-generated insights
- **🔄 Multiple Formats**: Export flashcards to CSV, JSON, or Anki-compatible formats
- **🎨 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd tutorbot-app
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```
Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
tutorbot-app/
├── .kiro/                    # Kiro configuration and specs
│   ├── specs/               # Backend API specifications
│   ├── steering/            # Development guidelines
│   └── hooks/               # Agent automation hooks
├── frontend/                # React components and pages
│   ├── components/          # Reusable UI components
│   ├── pages/              # Next.js pages
│   └── styles/             # Global CSS styles
├── backend/                 # Backend utilities
│   └── utils/              # AI and PDF generation utilities
├── pages/api/              # Next.js API routes
├── hooks/                  # Kiro agent hooks
└── public/                 # Static assets
```

## 🎯 How to Use

1. **Enter a Topic**: Type any subject you want to learn (e.g., "React Hooks", "Photosynthesis", "Machine Learning")
2. **Generate Content**: Click "Generate Module" and wait for AI to create your personalized learning materials
3. **Study**: 
   - Read the comprehensive lesson with examples
   - Practice with interactive flashcards
   - Test your knowledge with the quiz
4. **Export**: Download PDF summaries or export flashcards for external study tools

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run type-check   # TypeScript type checking
```

## 🤖 Kiro Integration

TutorBot showcases advanced Kiro capabilities:

### Agent Hooks
- **📄 Auto PDF Generation**: Automatically creates study summaries with AI insights
- **📇 Flashcard Export**: Exports to multiple formats (CSV, JSON, Anki)
- **🧪 Test Generation**: Auto-generates unit tests for API routes

### Steering Rules
- **Development Guidelines**: TypeScript standards and best practices
- **AI Prompting**: Optimized prompts for educational content generation

### Specifications
- **Backend API Spec**: Comprehensive API documentation and implementation guide

## 🏗️ Architecture

### Frontend
- **Next.js 14** with TypeScript
- **React 18** with hooks and modern patterns
- **CSS3** with responsive design and animations
- **PrismJS** for syntax highlighting

### Backend
- **Next.js API Routes** for serverless functions
- **OpenAI GPT-3.5-turbo** for content generation
- **pdf-lib** for PDF generation
- **Comprehensive error handling** and validation

### AI Integration
- **Structured prompts** for consistent educational content
- **JSON response parsing** with validation
- **Rate limiting** and error recovery
- **Token optimization** for cost efficiency

## 🧪 Testing

Comprehensive test suite included:

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
```

Tests cover:
- API route functionality
- Error handling scenarios
- Input validation
- AI service integration
- Component rendering

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. Deploy automatically on push to main branch

### Other Platforms
The app works on any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key_here          # Required: OpenAI API access
NEXT_PUBLIC_APP_URL=https://your-domain.com      # Required: Your app URL
```

### Customization
- **AI Models**: Modify `backend/utils/ai.ts` to use different OpenAI models
- **Styling**: Update `frontend/styles/global.css` for custom themes
- **Content**: Adjust prompts in AI utility functions for different content styles

## 📚 API Documentation

### Endpoints

#### `POST /api/generate-lessons`
Generate comprehensive lessons for any topic.

**Request:**
```json
{
  "topic": "React Hooks"
}
```

**Response:**
```json
{
  "title": "Understanding React Hooks",
  "content": "Detailed lesson content...",
  "codeExamples": ["const [state, setState] = useState(0);"],
  "bulletPoints": ["Key concept 1", "Key concept 2"]
}
```

#### `POST /api/generate-quiz`
Create interactive quizzes with scoring.

#### `POST /api/generate-flashcards`
Generate flashcards for effective memorization.

#### `POST /api/export-pdf`
Export learning materials as formatted PDF.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing powerful language models
- **Kiro** for intelligent development assistance
- **Next.js** team for the excellent framework
- **Vercel** for seamless deployment platform

---

**Built with ❤️ using Kiro AI Assistant**