const errorHandler = require('../middleware/errorHandler');

describe('Error Handler Middleware', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('should handle rate limit errors', () => {
    const error = new Error('Rate limit exceeded');
    error.response = {
      status: 429,
      data: {
        message: 'Rate limit exceeded'
      }
    };

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(429);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Rate limit exceeded. Please try again later.'
    });
  });

  it('should handle FavQs API errors', () => {
    const error = new Error('FavQs API error occurred');

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(503);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'External API service error. Please try again later.'
    });
  });

  it('should handle generic errors', () => {
    const error = new Error('Some unexpected error');

    errorHandler(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });
}); 