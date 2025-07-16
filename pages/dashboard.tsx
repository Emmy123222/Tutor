import { useState, useEffect } from 'react';
import LessonViewer from '../frontend/components/LessonViewer';
import Flashcard from '../frontend/components/Flashcard';
import QuizComponent from '../frontend/components/QuizComponent';

interface Lesson {
  title: string;
  content: string;
  codeExamples?: string[];
  bulletPoints: string[];
}

interface FlashcardData {
  term: string;
  definition: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function Dashboard() {
  const [topic, setTopic] = useState<string>('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentTopic = sessionStorage.getItem('currentTopic');
    if (currentTopic) {
      setTopic(currentTopic);
      generateContent(currentTopic);
    } else {
      setError('No topic selected');
      setLoading(false);
    }
  }, []);

  const generateContent = async (topicName: string) => {
    try {
      setLoading(true);
      
      // Generate lesson, flashcards, and quiz in parallel
      const [lessonRes, flashcardsRes, quizRes] = await Promise.all([
        fetch('/api/generate-lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicName })
        }),
        fetch('/api/generate-flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicName })
        }),
        fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicName })
        })
      ]);

      const lessonData = await lessonRes.json();
      const flashcardsData = await flashcardsRes.json();
      const quizData = await quizRes.json();

      // Ensure data is in correct format with proper validation
      const validatedLesson = lessonData && typeof lessonData === 'object' ? {
        title: lessonData.title || `Lesson: ${topicName}`,
        content: lessonData.content || 'Content not available',
        codeExamples: Array.isArray(lessonData.codeExamples) ? lessonData.codeExamples : undefined,
        bulletPoints: Array.isArray(lessonData.bulletPoints) ? lessonData.bulletPoints : []
      } : null;
      
      setLesson(validatedLesson);
      setFlashcards(Array.isArray(flashcardsData) ? flashcardsData : []);
      setQuiz(Array.isArray(quizData) ? quizData : []);
    } catch (err) {
      console.error('Content generation error:', err);
      setError('Failed to generate content. Please try again or check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, lesson, flashcards })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic}-summary.pdf`;
      a.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) return <div className="loading">Generating your learning module...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <h1>Learning Module: {topic}</h1>
        <div className="export-buttons">
          <button onClick={exportToPDF} className="export-btn">
            📄 Export PDF
          </button>
          <button onClick={() => window.location.href = '/'} className="back-btn">
            ← Back to Home
          </button>
        </div>
      </header>

      <div className="content-grid">
        <section className="lesson-section">
          <h2>📚 Lesson</h2>
          {lesson ? (
            <LessonViewer lesson={lesson} />
          ) : (
            <p>No lesson content available</p>
          )}
        </section>

        <section className="flashcards-section">
          <h2>📇 Flashcards</h2>
          <div className="flashcards-grid">
            {flashcards && flashcards.length > 0 ? (
              flashcards.map((card: FlashcardData, index: number) => (
                <Flashcard key={index} term={card.term} definition={card.definition} />
              ))
            ) : (
              <p>No flashcards available</p>
            )}
          </div>
        </section>

        <section className="quiz-section">
          <h2>🧠 Quiz</h2>
          {quiz && quiz.length > 0 ? (
            <QuizComponent questions={quiz} />
          ) : (
            <p>No quiz questions available</p>
          )}
        </section>
      </div>
    </div>
  );
}