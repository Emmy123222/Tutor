/**
 * Kiro Agent Hook: Flashcard Export
 *
 * Allows exporting flashcards to Anki-compatible .csv format
 * and other study formats for external use.
 *
 * Trigger: Manual or after flashcard generation
 * Note: This hook uses Node.js `fs` and `path` modules, so it must be called
 * in a server-side context (e.g., API route, getServerSideProps) in Next.js.
 */

interface Flashcard {
    term: string;
    definition: string;
}

interface FlashcardExportContext {
    topic: string;
    flashcards: Flashcard[];
    format: 'csv' | 'anki' | 'json';
}

interface FlashcardExportResult {
    success: boolean;
    message: string;
    downloadUrl?: string;
    fileName?: string;
    stats?: {
        totalCards: number;
        averageTermLength: number;
        averageDefinitionLength: number;
        estimatedStudyTime: string;
    };
    instructions?: string;
    error?: string;
}

export async function flashcardExport(context: FlashcardExportContext): Promise<FlashcardExportResult> {
    try {
        const { topic, flashcards, format } = context;

        // Validate flashcards
        if (!validateFlashcards(flashcards)) {
            throw new Error('Invalid flashcard data: All cards must have non-empty term and definition strings');
        }

        let exportContent: string;
        let fileName: string;
        let mimeType: string;

        switch (format) {
            case 'csv':
            case 'anki':
                // Anki-compatible CSV format: Front,Back,Tags
                exportContent = 'Front,Back,Tags\n';
                exportContent += flashcards
                    .map(
                        (card) =>
                            `"${card.term.replace(/"/g, '""')}","${card.definition.replace(/"/g, '""')}","${topic}"`
                    )
                    .join('\n');
                fileName = `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_flashcards.csv`;
                mimeType = 'text/csv';
                break;

            case 'json':
                exportContent = JSON.stringify(
                    {
                        topic,
                        created: new Date().toISOString(),
                        flashcards,
                    },
                    null,
                    2
                );
                fileName = `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_flashcards.json`;
                mimeType = 'application/json';
                break;

            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        // Save file to public directory (server-side only)
        const fs = require('fs');
        const path = require('path');

        const filePath = path.join(process.cwd(), 'public', fileName);
        fs.writeFileSync(filePath, exportContent, 'utf8');

        // Generate study statistics
        const stats = {
            totalCards: flashcards.length,
            averageTermLength: Math.round(
                flashcards.reduce((sum, card) => sum + card.term.length, 0) / flashcards.length
            ),
            averageDefinitionLength: Math.round(
                flashcards.reduce((sum, card) => sum + card.definition.length, 0) / flashcards.length
            ),
            estimatedStudyTime: `${Math.ceil(flashcards.length * 2)} minutes`,
        };

        return {
            success: true,
            message: `Flashcards exported successfully in ${format.toUpperCase()} format`,
            downloadUrl: `/${fileName}`,
            fileName,
            stats,
            instructions:
                format === 'anki'
                    ? 'Import this CSV file into Anki using File > Import. Make sure to map Front->Front, Back->Back, and Tags->Tags.'
                    : 'Download and use this file with your preferred study application.',
        };
    } catch (error) {
        console.error('Flashcard export hook failed:', error);
        // Type guard to safely access error.message
        if (error instanceof Error) {
            return {
                success: false,
                message: 'Failed to export flashcards',
                error: error.message,
            };
        }
        return {
            success: false,
            message: 'Failed to export flashcards',
            error: String(error) || 'An unknown error occurred',
        };
    }
}

// Helper function to validate flashcard data
export function validateFlashcards(flashcards: any[]): boolean {
    return flashcards.every(
        (card) =>
            card &&
            typeof card.term === 'string' &&
            typeof card.definition === 'string' &&
            card.term.trim().length > 0 &&
            card.definition.trim().length > 0
    );
}