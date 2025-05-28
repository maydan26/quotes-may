const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle rate limit errors
  if (err.response && err.response.status === 429) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please try again later.'
    });
  }

  // Handle FavQs API errors
  if (err.message.includes('FavQs API')) {
    return res.status(503).json({
      error: 'External API service error. Please try again later.'
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = errorHandler; 