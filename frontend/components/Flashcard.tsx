import { useState } from 'react';

interface FlashcardProps {
  term: string;
  definition: string;
}

export default function Flashcard({ term, definition }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="card-content">
            <h4>Term</h4>
            <p>{term}</p>
          </div>
          <div className="flip-hint">Click to flip</div>
        </div>
        <div className="flashcard-back">
          <div className="card-content">
            <h4>Definition</h4>
            <p>{definition}</p>
          </div>
          <div className="flip-hint">Click to flip back</div>
        </div>
      </div>
    </div>
  );
}