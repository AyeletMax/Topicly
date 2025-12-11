const { analyzeMoodWithGemini } = require('../services/gemini.service');
const fs = require('fs');
const path = require('path');

// Mock Gemini API
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest.fn().mockReturnValue(JSON.stringify({
                mood: 'happy',
                confidence: 0.85,
                description: 'The person appears happy and cheerful'
              }))
            }
          })
        })
      };
    })
  };
});

describe('analyzeMoodWithGemini', () => {
  test('should throw error if GEMINI_API_KEY is not set', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    await expect(analyzeMoodWithGemini('test-path')).rejects.toThrow('GEMINI_API_KEY');

    process.env.GEMINI_API_KEY = originalKey;
  });

  // Note: Full integration test would require actual API key and image file
  // This is a unit test structure
});

