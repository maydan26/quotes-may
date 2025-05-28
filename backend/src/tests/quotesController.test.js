const request = require('supertest');
const app = require('../app');
const { fetchQuotes } = require('../services/quotesService');

// Mock the quotesService
jest.mock('../services/quotesService');

describe('Quotes Controller', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should get quotes successfully', async () => {
    // Mock data
    const mockQuotes = [
      {
        id: 1,
        text: 'Test quote 1',
        author: 'Author 1',
        tags: ['test']
      }
    ];

    // Mock service response
    fetchQuotes.mockResolvedValue(mockQuotes);

    // Test API endpoint
    const response = await request(app)
      .get('/api/quotes')
      .query({ count: 1 });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuotes);
    expect(fetchQuotes).toHaveBeenCalledWith(1, undefined);
  });

  it('should handle tag filtering', async () => {
    // Mock data
    const mockQuotes = [
      {
        id: 1,
        text: 'Love quote',
        author: 'Author 1',
        tags: ['love']
      }
    ];

    // Mock service response
    fetchQuotes.mockResolvedValue(mockQuotes);

    // Test API endpoint with tag filter
    const response = await request(app)
      .get('/api/quotes')
      .query({ 
        count: 1,
        filter: 'love',
        type: 'tag'
      });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuotes);
    expect(fetchQuotes).toHaveBeenCalledWith(1, 'love');
  });

  it('should validate count parameter', async () => {
    // Test with invalid count
    const response = await request(app)
      .get('/api/quotes')
      .query({ count: 51 }); // More than maximum allowed

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Count must be between 1 and 50');
    expect(fetchQuotes).not.toHaveBeenCalled();
  });

  it('should handle service errors', async () => {
    // Mock service error
    fetchQuotes.mockRejectedValue(new Error('FavQs API error'));

    // Test error handling
    const response = await request(app)
      .get('/api/quotes')
      .query({ count: 1 });

    // Assertions
    expect(response.status).toBe(503);
    expect(response.body).toHaveProperty('error', 'External API service error. Please try again later.');
  });

  it('should handle rate limiting', async () => {
    // Mock service response
    fetchQuotes.mockRejectedValue({
      response: {
        status: 429,
        data: {
          message: 'Rate limit exceeded'
        }
      }
    });

    // Test API endpoint
    const response = await request(app)
      .get('/api/quotes')
      .query({ count: 1 });

    // Assertions
    expect(response.status).toBe(429);
    expect(response.body).toHaveProperty('error', 'Rate limit exceeded. Please try again later.');
  });

  it('should handle missing type parameter when filter is provided', async () => {
    // Mock data
    const mockQuotes = [
      {
        id: 1,
        text: 'Some quote',
        author: 'Author 1',
        tags: ['test']
      }
    ];

    // Mock service response
    fetchQuotes.mockResolvedValue(mockQuotes);

    // Test with filter but no type
    const response = await request(app)
      .get('/api/quotes')
      .query({ 
        count: 1,
        filter: 'love'
        // type parameter intentionally omitted
      });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuotes);
    expect(fetchQuotes).toHaveBeenCalledWith(1, undefined);
  });
}); 