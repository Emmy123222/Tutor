import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePDF } from '../../backend/utils/pdf';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, lesson, flashcards } = req.body;

    if (!topic || !lesson || !flashcards) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const pdfBytes = await generatePDF(topic, lesson, flashcards);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${topic}-summary.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error in export-pdf:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}