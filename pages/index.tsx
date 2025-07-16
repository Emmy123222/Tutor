import { useState } from 'react';
import { useRouter } from 'next/router';
import SubjectInput from '../frontend/components/SubjectInput';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerateModule = async (topic: string) => {
    setIsGenerating(true);
    try {
      // Store topic in sessionStorage for dashboard
      sessionStorage.setItem('currentTopic', topic);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error generating module:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>TutorBot 🧠</h1>
        <p>Your AI-powered learning companion</p>
      </header>
      
      <main className="main">
        <div className="hero">
          <h2>Learn Any Topic with AI</h2>
          <p>Enter a subject and get personalized lessons, quizzes, and flashcards</p>
        </div>
        
        <SubjectInput 
          onSubmit={handleGenerateModule}
          isLoading={isGenerating}
        />
        
        <div className="features">
          <div className="feature">
            <h3>📚 Interactive Lessons</h3>
            <p>Detailed explanations with examples</p>
          </div>
          <div className="feature">
            <h3>🧠 Smart Quizzes</h3>
            <p>Test your knowledge with AI-generated questions</p>
          </div>
          <div className="feature">
            <h3>📇 Flashcards</h3>
            <p>Memorize key concepts effectively</p>
          </div>
        </div>
      </main>
    </div>
  );
}