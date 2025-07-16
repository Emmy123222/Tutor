# TutorBot Backend API Specification

## Overview
This specification defines the backend API routes for TutorBot, an AI-powered educational application that generates personalized learning content.

## API Endpoints

### 1. Generate Lessons
**Endpoint:** `POST /api/generate-lessons`

**Input:**
```typescript
{
  topic: string
}
```

**Output:**
```typescript
{
  title: string;
  content: string;
  codeExamples?: string[];
  bulletPoints: string[];
}
```

**AI Prompt Strategy:**
- Use expert teacher persona
- Include overview, detailed explanation, real-world examples
- Add code examples for technical topics
- Provide summary bullet points

### 2. Generate Quiz
**Endpoint:** `POST /api/generate-quiz`

**Input:**
```typescript
{
  topic: string
}
```

**Output:**
```typescript
Array<{
  question: string;
  options: string[]; // Empty array for short answer questions
  answer: string;
}>
```

**Features:**
- Mix of multiple choice and short answer questions
- 5 questions per quiz
- Include correct answers for validation

### 3. Generate Flashcards
**Endpoint:** `POST /api/generate-flashcards`

**Input:**
```typescript
{
  topic: string
}
```

**Output:**
```typescript
Array<{
  term: string;
  definition: string;
}>
```

**Features:**
- Generate 5 flashcards per topic
- Clear term and definition pairs
- Optimized for memorization

### 4. Export PDF
**Endpoint:** `POST /api/export-pdf`

**Input:**
```typescript
{
  topic: string;
  lesson: LessonData;
  flashcards: FlashcardData[];
}
```

**Output:** PDF file download

**Features:**
- Formatted PDF with lesson content
- Include flashcards section
- Professional layout using pdf-lib

## Implementation Requirements

### Error Handling
- Validate input parameters
- Handle OpenAI API rate limits
- Return appropriate HTTP status codes
- Log errors for debugging

### Security
- Validate API key presence
- Sanitize user inputs
- Implement rate limiting
- Handle malicious prompts

### Performance
- Implement caching for common topics
- Optimize AI prompt lengths
- Handle concurrent requests
- Monitor API usage

## AI Integration Guidelines

### OpenAI Configuration
- Use GPT-3.5-turbo for cost efficiency
- Set appropriate temperature (0.7 for creative content)
- Implement retry logic for failed requests
- Monitor token usage

### Prompt Engineering
- Use clear, specific instructions
- Include output format requirements
- Add examples for complex formats
- Validate AI responses before returning