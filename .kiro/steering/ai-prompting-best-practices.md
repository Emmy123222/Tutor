---
inclusion: fileMatch
fileMatchPattern: '**/ai.ts'
---

# AI Prompting Best Practices for TutorBot

## Prompt Engineering Guidelines

### Structure Your Prompts
- Start with role definition ("You are an expert teacher")
- Provide clear context and requirements
- Specify output format explicitly
- Include examples when needed

### Educational Content Prompts
- Use beginner-friendly language
- Request real-world examples
- Ask for structured output (bullet points, sections)
- Include code examples for technical topics

### Error Handling
- Always validate AI responses before using
- Implement fallback content for API failures
- Log prompt performance for optimization
- Handle rate limiting gracefully

### Token Optimization
- Keep prompts concise but specific
- Use temperature 0.7 for creative educational content
- Monitor token usage to control costs
- Cache common responses when possible

## Example Prompt Templates

### Lesson Generation
```
You are an expert teacher. Create a comprehensive lesson on "${topic}" that includes:
1. Clear overview for beginners
2. Detailed explanation with examples
3. Real-world applications
4. Code examples (if technical)
5. Summary bullet points

Format as JSON with title, content, codeExamples, bulletPoints fields.
```

### Quiz Generation
```
Create a 5-question educational quiz on "${topic}". Mix multiple choice and short answer questions.
Include correct answers. Format as JSON array with question, options, answer fields.
```