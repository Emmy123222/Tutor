import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateLesson(topic: string) {
    const lessonPrompt = `Create a lesson about "${topic}". Return only valid JSON:

{
  "title": "Understanding ${topic}",
  "content": "Detailed lesson content about ${topic}. Explain the basics, provide examples, and make it educational for beginners.",
  "codeExamples": [],
  "bulletPoints": ["Key point 1", "Key point 2", "Key point 3"]
}`;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: lessonPrompt }],
            temperature: 0.7,
            max_tokens: 2048,
        });

        const response = completion.choices[0].message.content;
        if (!response) {
            throw new Error('No response from AI');
        }

        // Clean the response to extract JSON
        let cleanedResponse = response.trim();

        // Remove markdown code blocks if present
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        try {
            const parsed = JSON.parse(cleanedResponse);
            return parsed || {};
        } catch (parseError) {
            console.error('Failed to parse lesson JSON. Raw response:', response);
            console.error('Cleaned response:', cleanedResponse);
            console.error('Parse error:', parseError);

            // Try to extract JSON from the response using regex as fallback
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const extracted = JSON.parse(jsonMatch[0]);
                    console.log('Successfully extracted JSON using regex');
                    return extracted;
                } catch (regexParseError) {
                    console.error('Regex extraction also failed:', regexParseError);
                }
            }

            // Return a fallback lesson structure
            return {
                title: `Understanding ${topic}`,
                content: `This is a lesson about ${topic}. The AI response could not be parsed properly, but here's some basic information about the topic.`,
                codeExamples: [],
                bulletPoints: [
                    `Key concept about ${topic}`,
                    `Important aspect of ${topic}`,
                    `Practical application of ${topic}`
                ]
            };
        }
    } catch (error) {
        console.error('Error generating lesson:', error);
        throw new Error('Failed to generate lesson');
    }
}

export async function generateFlashcards(topic: string) {
    const flashcardPrompt = `Create 5 flashcards for "${topic}". Return only valid JSON:

[
  {"term": "Term 1", "definition": "Definition 1"},
  {"term": "Term 2", "definition": "Definition 2"},
  {"term": "Term 3", "definition": "Definition 3"},
  {"term": "Term 4", "definition": "Definition 4"},
  {"term": "Term 5", "definition": "Definition 5"}
]`;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: flashcardPrompt }],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const response = completion.choices[0].message.content;
        if (!response) {
            throw new Error('No response from AI');
        }

        // Clean the response to extract JSON
        let cleanedResponse = response.trim();

        // Remove markdown code blocks if present
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        try {
            const parsed = JSON.parse(cleanedResponse);
            // Ensure we return an array
            return Array.isArray(parsed) ? parsed : [];
        } catch (parseError) {
            console.error('Failed to parse flashcards JSON. Raw response:', response);
            console.error('Cleaned response:', cleanedResponse);
            console.error('Parse error:', parseError);

            // Try to extract JSON array from the response using regex as fallback
            const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    const extracted = JSON.parse(jsonMatch[0]);
                    console.log('Successfully extracted flashcards JSON using regex');
                    return Array.isArray(extracted) ? extracted : [];
                } catch (regexParseError) {
                    console.error('Regex extraction also failed:', regexParseError);
                }
            }

            // Return fallback flashcards
            return [
                { term: `${topic} Concept 1`, definition: `Basic definition related to ${topic}` },
                { term: `${topic} Concept 2`, definition: `Important aspect of ${topic}` },
                { term: `${topic} Concept 3`, definition: `Key principle in ${topic}` },
                { term: `${topic} Concept 4`, definition: `Practical application of ${topic}` },
                { term: `${topic} Concept 5`, definition: `Advanced topic in ${topic}` }
            ];
        }
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw new Error('Failed to generate flashcards');
    }
}

export async function generateQuiz(topic: string) {
    const quizPrompt = `Create 5 quiz questions about "${topic}". Return only valid JSON:

[
  {
    "question": "Question 1 about ${topic}?",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  },
  {
    "question": "Question 2 about ${topic}?",
    "options": ["True", "False"],
    "answer": "True"
  },
  {
    "question": "Question 3 about ${topic}?",
    "options": [],
    "answer": "Short answer"
  },
  {
    "question": "Question 4 about ${topic}?",
    "options": ["Option 1", "Option 2"],
    "answer": "Option 1"
  },
  {
    "question": "Question 5 about ${topic}?",
    "options": [],
    "answer": "Another short answer"
  }
]`;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: quizPrompt }],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const response = completion.choices[0].message.content;
        if (!response) {
            throw new Error('No response from AI');
        }

        // Clean the response to extract JSON
        let cleanedResponse = response.trim();

        // Remove markdown code blocks if present
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        try {
            const parsed = JSON.parse(cleanedResponse);
            // Ensure we return an array
            return Array.isArray(parsed) ? parsed : [];
        } catch (parseError) {
            console.error('Failed to parse quiz JSON. Raw response:', response);
            console.error('Cleaned response:', cleanedResponse);
            console.error('Parse error:', parseError);

            // Try to extract JSON array from the response using regex as fallback
            const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                try {
                    const extracted = JSON.parse(jsonMatch[0]);
                    console.log('Successfully extracted quiz JSON using regex');
                    return Array.isArray(extracted) ? extracted : [];
                } catch (regexParseError) {
                    console.error('Regex extraction also failed:', regexParseError);
                }
            }

            // Return fallback quiz questions
            return [
                {
                    question: `What is the main purpose of ${topic}?`,
                    options: ["To solve problems", "To create complexity", "To demonstrate knowledge", "To replace existing methods"],
                    answer: "To solve problems"
                },
                {
                    question: `Which is a key characteristic of ${topic}?`,
                    options: ["Simplicity", "Complexity", "Randomness", "Confusion"],
                    answer: "Simplicity"
                },
                {
                    question: `How would you describe ${topic} in your own words?`,
                    options: [],
                    answer: `${topic} is a concept that helps solve specific problems or achieve certain goals.`
                },
                {
                    question: `True or False: ${topic} has practical applications.`,
                    options: ["True", "False"],
                    answer: "True"
                },
                {
                    question: `What is one benefit of understanding ${topic}?`,
                    options: [],
                    answer: `Understanding ${topic} helps in problem-solving and practical applications.`
                }
            ];
        }
    } catch (error) {
        console.error('Error generating quiz:', error);
        throw new Error('Failed to generate quiz');
    }
}