const { fetchQuotes } = require('../services/quotesService');

const getQuotes = async (req, res, next) => {
  try {
    const count = parseInt(req.query.count) || 1;
    const filter = req.query.filter;
    const type = req.query.type;

    // Input validation
    if (count < 1 || count > 50) {
      return res.status(400).json({
        error: 'Count must be between 1 and 50'
      });
    }

    // Only use filter if type is also provided
    const tag = type === 'tag' ? filter : undefined;
    const quotes = await fetchQuotes(count, tag);
    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuotes
}; 