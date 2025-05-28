import React, { useState } from 'react';
import './App.css';
import QuoteForm from './components/QuoteForm';
import QuoteList from './components/QuoteList';

function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuotes = async (count, tag) => {
    setLoading(true);
    setError('');
    try {
      // Validate count
      const numCount = parseInt(count);
      if (isNaN(numCount) || numCount < 1 || numCount > 50) {
        throw new Error('Please enter a valid number between 1 and 50');
      }

      const params = new URLSearchParams({
        count: numCount.toString()
      });
      
      if (tag && tag.trim()) {
        params.append('filter', tag.trim());
        params.append('type', 'tag');
      }

      const response = await fetch(`http://localhost:4000/api/quotes?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch quotes');
      }
      const data = await response.json();
      setQuotes(data);
    } catch (err) {
      setError(err.message);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Quotes of the Day</h1>
      </header>
      <main className="container">
        <QuoteForm onSubmit={fetchQuotes} />
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div className="loading">Loading quotes...</div>
        ) : (
          <QuoteList quotes={quotes} />
        )}
      </main>
    </div>
  );
}

export default App;
