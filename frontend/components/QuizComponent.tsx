import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
}

export default function QuizComponent({ questions }: QuizComponentProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitQuiz = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    return (
      <div className="quiz-results">
        <h3>Quiz Results</h3>
        <div className="score">
          Score: {score}/{questions.length} ({Math.round((score/questions.length) * 100)}%)
        </div>
        
        <div className="results-breakdown">
          {questions.map((question, index) => (
            <div key={index} className="result-item">
              <p className="question">{question.question}</p>
              <p className={`answer ${answers[index] === question.answer ? 'correct' : 'incorrect'}`}>
                Your answer: {answers[index] || 'Not answered'}
              </p>
              {answers[index] !== question.answer && (
                <p className="correct-answer">Correct answer: {question.answer}</p>
              )}
            </div>
          ))}
        </div>
        
        <button onClick={resetQuiz} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-component">
      {questions.map((question, index) => (
        <div key={index} className="quiz-question">
          <h4>Question {index + 1}</h4>
          <p>{question.question}</p>
          
          {question.options.length > 1 ? (
            // Multiple choice
            <div className="options">
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            // Short answer
            <input
              type="text"
              placeholder="Enter your answer"
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="short-answer"
            />
          )}
        </div>
      ))}
      
      <button 
        onClick={submitQuiz}
        className="submit-quiz-btn"
        disabled={Object.keys(answers).length !== questions.length}
      >
        Submit Quiz
      </button>
    </div>
  );
}