const axios = require('axios');

const FAVQS_API_URL = process.env.FAVQS_API_URL || 'https://favqs.com/api';
const FAVQS_API_KEY = process.env.FAVQS_API_KEY;

if (!FAVQS_API_KEY) {
  console.error('FAVQS_API_KEY is not set in .env file');
  process.exit(1);
}

const fetchQuotes = async (count, tag) => {
  try {
    // Create axios instance with default config
    const api = axios.create({
      baseURL: FAVQS_API_URL,
      headers: {
        'Authorization': `Token token=${FAVQS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const quotes = [];
    let page = 1;
    
    while (quotes.length < count) {
      const params = {
        page
      };

      // Add filter parameters if tag is provided
      if (tag) {
        params.filter = tag;
        params.type = 'tag';
      }

      const response = await api.get('/quotes', { params });
      
      if (!response.data.quotes) {
        throw new Error('Invalid response from FavQs API');
      }

      quotes.push(...response.data.quotes);

      // If we've reached the last page or have enough quotes, break
      if (response.data.last_page || !response.data.quotes.length || quotes.length >= count) {
        break;
      }

      page++;
    }

    // Return the requested number of quotes
    return quotes.slice(0, count).map(quote => ({
      id: quote.id,
      text: quote.body,
      author: quote.author,
      tags: quote.tags
    }));
  } catch (error) {
    if (error.response) {
      console.log(error.response)
      // FavQs API error
      throw new Error(error.response.data.message || 'FavQs API error');
    }
    throw error;
  }
};

module.exports = {
  fetchQuotes
}; 