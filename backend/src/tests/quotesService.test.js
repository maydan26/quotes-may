const axios = require('axios');
const { fetchQuotes } = require('../services/quotesService');

// Mock axios
jest.mock('axios');

describe('QuotesService', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mock axios instance with all necessary methods
    mockAxiosInstance = {
      get: jest.fn(),
      defaults: {
        baseURL: 'https://favqs.com/api',
        headers: {
          'Authorization': 'Token token=test-api-key',
          'Content-Type': 'application/json'
        }
      }
    };

    // Mock axios.create to return our mock instance
    axios.create = jest.fn().mockReturnValue(mockAxiosInstance);
  });

  it('should fetch quotes successfully', async () => {
    // Mock data
    const mockQuotes = [
      {
        id: 1,
        body: 'Test quote 1',
        author: 'Author 1',
        tags: ['test', 'mock']
      },
      {
        id: 2,
        body: 'Test quote 2',
        author: 'Author 2',
        tags: ['test']
      }
    ];

    // Mock axios response
    mockAxiosInstance.get.mockResolvedValue({
      data: {
        quotes: mockQuotes
      }
    });

    // Test fetching quotes
    const result = await fetchQuotes(2);

    // Assertions
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 1,
      text: 'Test quote 1',
      author: 'Author 1',
      tags: ['test', 'mock']
    });
  });

  it('should handle tag filtering correctly', async () => {
    // Mock data for tag filtering
    const mockQuotes = [
      {
        id: 1,
        body: 'Love quote',
        author: 'Author 1',
        tags: ['love', 'romance']
      }
    ];

    // Mock axios response
    mockAxiosInstance.get.mockResolvedValue({
      data: {
        quotes: mockQuotes
      }
    });

    // Test fetching quotes with tag
    const result = await fetchQuotes(1, 'love');

    // Verify that the correct parameters were passed
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/quotes', {
      params: {
        page: 1,
        filter: 'love',
        type: 'tag'
      }
    });

    // Verify the response
    expect(result).toHaveLength(1);
    expect(result[0].tags).toContain('love');
  });

  it('should handle pagination correctly', async () => {
    // Mock data for multiple pages
    const mockQuotesPage1 = [
      {
        id: 1,
        body: 'Quote 1',
        author: 'Author 1',
        tags: ['test']
      }
    ];
    const mockQuotesPage2 = [
      {
        id: 2,
        body: 'Quote 2',
        author: 'Author 2',
        tags: ['test']
      }
    ];

    // Mock axios response for multiple pages
    mockAxiosInstance.get
      .mockResolvedValueOnce({
        data: {
          quotes: mockQuotesPage1,
          page: 1,
          last_page: false
        }
      })
      .mockResolvedValueOnce({
        data: {
          quotes: mockQuotesPage2,
          page: 2,
          last_page: true
        }
      });

    // Test fetching quotes with pagination
    const result = await fetchQuotes(2);

    // Verify pagination calls
    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    expect(mockAxiosInstance.get).toHaveBeenNthCalledWith(1, '/quotes', { params: { page: 1 } });
    expect(mockAxiosInstance.get).toHaveBeenNthCalledWith(2, '/quotes', { params: { page: 2 } });

    // Verify combined results
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockAxiosInstance.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          message: 'API rate limit exceeded'
        }
      }
    });

    // Test error handling
    await expect(fetchQuotes(1)).rejects.toThrow('API rate limit exceeded');
  });

  it('should handle invalid API responses', async () => {
    // Mock invalid response (missing quotes array)
    mockAxiosInstance.get.mockResolvedValue({
      data: {}
    });

    // Test invalid response handling
    await expect(fetchQuotes(1)).rejects.toThrow('Invalid response from FavQs API');
  });
}); 