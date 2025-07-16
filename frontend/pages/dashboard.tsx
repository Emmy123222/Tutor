import { useState, useEffect } from 'react';
import LessonViewer from '../components/LessonViewer';
import Flashcard from '../components/Flashcard';
import QuizComponent from '../components/QuizComponent';

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

      setLesson(lessonData);
      setFlashcards(flashcardsData);
      setQuiz(quizData);
    } catch (err) {
      setError('Failed to generate content');
      console.error(err);
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
          {lesson && <LessonViewer lesson={lesson} />}
        </section>

        <section className="flashcards-section">
          <h2>📇 Flashcards</h2>
          <div className="flashcards-grid">
            {flashcards.map((card, index) => (
              <Flashcard key={index} term={card.term} definition={card.definition} />
            ))}
          </div>
        </section>

        <section className="quiz-section">
          <h2>🧠 Quiz</h2>
          <QuizComponent questions={quiz} />
        </section>
      </div>
    </div>
  );
}