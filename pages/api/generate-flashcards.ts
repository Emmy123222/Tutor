import type { NextApiRequest, NextApiResponse } from 'next';
import { generateFlashcards } from '../../backend/utils/ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const flashcards = await generateFlashcards(topic);
    res.status(200).json(flashcards);
  } catch (error) {
    console.error('Error in generate-flashcards:', error);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
}