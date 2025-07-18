/**
 * Kiro Agent Hook: Summarize and Generate PDF
 *
 * This hook takes lesson content and flashcards, uses AI to generate a summary,
 * and automatically formats and exports to PDF using pdf-lib.
 *
 * Trigger: Manual or when lesson generation is complete
 * Note: This hook uses Node.js `fs` and `path` modules, so it must be called
 * in a server-side context (e.g., API route, getServerSideProps) in Next.js.
 */

import { generatePDF } from '../backend/utils/pdf';
import Groq from 'groq-sdk';

// Define interfaces for type safety
interface Lesson {
  title: string;
  content: string;
  bulletPoints: string[];
}

interface Flashcard {
  term: string;
  definition: string;
}

interface HookContext {
  topic: string;
  lesson: Lesson;
  flashcards: Flashcard[];
}

interface SummarizeAndGeneratePDFResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  summary?: string;
  error?: string;
}

export async function summarizeAndGeneratePDF(context: HookContext): Promise<SummarizeAndGeneratePDFResult> {
  const openai = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    // Generate AI summary of the lesson content
    const summaryPrompt = `
      Summarize the following lesson content into key takeaways and important concepts.
      Make it concise but comprehensive for study purposes.
      
      Topic: ${context.topic}
      Lesson Content: ${context.lesson.content}
      
      Provide a structured summary with:
      1. Main concepts
      2. Key takeaways
      3. Important details to remember
    `;

    const completion = await openai.chat.completions.create({
      model: 'mixtral-8x7b-32768', // Updated to a likely valid Groq model
      messages: [{ role: 'user', content: summaryPrompt }],
      temperature: 0.5,
    });

    const aiSummary = completion.choices[0].message.content || '';

    // Create enhanced lesson object with AI summary
    const enhancedLesson = {
      ...context.lesson,
      content: context.lesson.content + '\n\n--- AI SUMMARY ---\n' + aiSummary,
    };

    // Generate PDF with enhanced content
    const pdfBytes = await generatePDF(context.topic, enhancedLesson, context.flashcards);

    // Save PDF to public directory for download
    const fs = require('fs');
    const path = require('path');

    const fileName = `${context.topic.replace(/[^a-zA-Z0-9]/g, '_')}_summary.pdf`;
    const filePath = path.join(process.cwd(), 'public', fileName);

    fs.writeFileSync(filePath, pdfBytes);

    return {
      success: true,
      message: 'PDF generated successfully with AI summary',
      downloadUrl: `/${fileName}`,
      summary: aiSummary,
    };
  } catch (error) {
    console.error('Hook execution failed:', error);
    // Type guard to safely access error.message
    if (error instanceof Error) {
      return {
        success: false,
        message: 'Failed to generate PDF with summary',
        error: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to generate PDF with summary',
      error: String(error) || 'An unknown error occurred',
    };
  }
}