import { useState } from 'react';

interface SubjectInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export default function SubjectInput({ onSubmit, isLoading }: SubjectInputProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="subject-form">
      <div className="input-group">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Python Loops, World War II)"
          className="topic-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="generate-btn"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Module'}
        </button>
      </div>
    </form>
  );
}