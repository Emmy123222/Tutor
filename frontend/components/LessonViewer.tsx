import { useEffect } from 'react';

interface Lesson {
  title: string;
  content: string;
  codeExamples?: string[];
  bulletPoints: string[];
}

interface LessonViewerProps {
  lesson: Lesson;
}

export default function LessonViewer({ lesson }: LessonViewerProps) {
  useEffect(() => {
    // Dynamic import for Prism to avoid SSR issues
    if (typeof window !== 'undefined') {
      import('prismjs').then((Prism) => {
        import('prismjs/themes/prism-tomorrow.css');
        import('prismjs/components/prism-javascript');
        import('prismjs/components/prism-python');
        import('prismjs/components/prism-typescript');
        Prism.highlightAll();
      });
    }
  }, [lesson]);

  return (
    <div className="lesson-viewer">
      <h3>{lesson.title}</h3>
      
      <div className="lesson-content">
        <div className="content-text">
          {lesson.content ? lesson.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          )) : <p>No content available</p>}
        </div>

        {lesson.codeExamples && Array.isArray(lesson.codeExamples) && lesson.codeExamples.length > 0 && (
          <div className="code-examples">
            <h4>Code Examples:</h4>
            {lesson.codeExamples.map((code, index) => (
              <pre key={index} className="code-block">
                <code className="language-javascript">{code}</code>
              </pre>
            ))}
          </div>
        )}

        {lesson.bulletPoints && Array.isArray(lesson.bulletPoints) && lesson.bulletPoints.length > 0 && (
          <div className="summary-points">
            <h4>Key Points:</h4>
            <ul>
              {lesson.bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}