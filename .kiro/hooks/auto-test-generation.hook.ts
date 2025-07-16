/**
 * Kiro Agent Hook: Auto Test Generation
 * 
 * Automatically generates unit tests for API routes when they are created or modified.
 * This ensures code quality and helps catch bugs early in development.
 * 
 * Trigger: When API route files are saved
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface TestGenerationContext {
  filePath: string;
  fileContent: string;
  routeName: string;
}

export async function generateAPITests(context: TestGenerationContext) {
  try {
    const { filePath, fileContent, routeName } = context;
    
    // Extract function signature and logic from API route
    const functionMatch = fileContent.match(/export default async function handler\((.*?)\)/s);
    const methodChecks = fileContent.match(/req\.method !== ['"](\w+)['"]/g) || [];
    const bodyParams = fileContent.match(/const \{ (.*?) \} = req\.body/);
    
    if (!functionMatch) {
      return { success: false, message: 'Could not parse API route structure' };
    }

    const methods = methodChecks.map(check => check.match(/['"](\w+)['"]/)?.[1]).filter(Boolean);
    const params = bodyParams?.[1]?.split(',').map(p => p.trim()) || [];

    // Generate comprehensive test file
    const testContent = `
import { createMocks } from 'node-mocks-http';
import handler from '../${routeName}';

describe('/api/${routeName}', () => {
  beforeEach(() => {
    // Setup test environment
    process.env.OPENAI_API_KEY = 'test-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  ${methods.includes('POST') ? `
  describe('POST requests', () => {
    it('should handle valid requests successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ${params.map(param => `${param}: 'test-${param}'`).join(',\n          ')}
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data).toBeDefined();
    });

    it('should return 400 for missing required parameters', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.error).toBeDefined();
    });

    it('should handle AI service errors gracefully', async () => {
      // Mock AI service failure
      jest.mock('../../backend/utils/ai', () => ({
        ${routeName.includes('lesson') ? 'generateLesson' : 
          routeName.includes('quiz') ? 'generateQuiz' : 
          'generateFlashcards'}: jest.fn().mockRejectedValue(new Error('AI service error'))
      }));

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          ${params.map(param => `${param}: 'test-${param}'`).join(',\n          ')}
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
    });
  });
  ` : ''}

  it('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Method not allowed');
  });

  it('should validate input parameters properly', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ${params.map(param => `${param}: ''`).join(',\n        ')} // Empty values
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });
});
`;

    // Write test file
    const testFilePath = join(process.cwd(), '__tests__', 'api', `${routeName}.test.ts`);
    writeFileSync(testFilePath, testContent.trim());

    // Also generate package.json test script if it doesn't exist
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts.test) {
      packageJson.scripts.test = 'jest';
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        'jest': '^29.0.0',
        '@types/jest': '^29.0.0',
        'node-mocks-http': '^1.12.0'
      };
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    return {
      success: true,
      message: `Generated comprehensive tests for ${routeName} API route`,
      testFile: testFilePath,
      coverage: [
        'Success scenarios',
        'Error handling',
        'Input validation',
        'Method validation',
        'AI service failures'
      ]
    };

  } catch (error) {
    console.error('Test generation failed:', error);
    return {
      success: false,
      message: 'Failed to generate tests',
      error: error.message
    };
  }
}