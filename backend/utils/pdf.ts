import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Lesson {
  title: string;
  content: string;
  bulletPoints: string[];
}

interface Flashcard {
  term: string;
  definition: string;
}

export async function generatePDF(topic: string, lesson: Lesson, flashcards: Flashcard[]) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let yPosition = height - 50;

  // Title
  page.drawText(`TutorBot Learning Module: ${topic}`, {
    x: 50,
    y: yPosition,
    size: 20,
    font: timesRomanBoldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 40;

  // Lesson Title
  page.drawText(lesson.title, {
    x: 50,
    y: yPosition,
    size: 16,
    font: timesRomanBoldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 30;

  // Lesson Content
  const contentLines = lesson.content.split('\n');
  for (const line of contentLines) {
    if (yPosition < 100) {
      page = pdfDoc.addPage();
      yPosition = height - 50;
    }
    
    const wrappedLines = wrapText(line, 80);
    for (const wrappedLine of wrappedLines) {
      page.drawText(wrappedLine, {
        x: 50,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    }
  }

  // Key Points
  yPosition -= 20;
  page.drawText('Key Points:', {
    x: 50,
    y: yPosition,
    size: 14,
    font: timesRomanBoldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 25;

  for (const point of lesson.bulletPoints) {
    if (yPosition < 100) {
      page = pdfDoc.addPage();
      yPosition = height - 50;
    }
    
    page.drawText(`• ${point}`, {
      x: 60,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  }

  // Flashcards Section
  yPosition -= 30;
  if (yPosition < 100) {
    page = pdfDoc.addPage();
    yPosition = height - 50;
  }

  page.drawText('Flashcards:', {
    x: 50,
    y: yPosition,
    size: 14,
    font: timesRomanBoldFont,
    color: rgb(0, 0, 0),
  });
  yPosition -= 25;

  for (const flashcard of flashcards) {
    if (yPosition < 150) {
      page = pdfDoc.addPage();
      yPosition = height - 50;
    }

    page.drawText(`Term: ${flashcard.term}`, {
      x: 60,
      y: yPosition,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    const defLines = wrapText(flashcard.definition, 70);
    for (const line of defLines) {
      page.drawText(line, {
        x: 60,
        y: yPosition,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 18;
    }
    yPosition -= 15;
  }

  return await pdfDoc.save();
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}