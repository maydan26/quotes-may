import React, { useState } from 'react';
import './QuoteForm.css';

function QuoteForm({ onSubmit }) {
  const [count, setCount] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount < 1 || numCount > 50) {
      return; // HTML5 validation will handle the error message
    }

    // Call parent's onSubmit with the values (trim the tag)
    onSubmit(count, tag.trim());
  };

  const handleCountChange = (e) => {
    setCount(e.target.value);
  };

  return (
    <form className="quote-form" onSubmit={handleSubmit} role="form">
      <div className="form-group">
        <label htmlFor="count">Number of Quotes:</label>
        <input
          type="number"
          id="count"
          min="1"
          max="50"
          value={count}
          onChange={handleCountChange}
          placeholder="Enter a number (1-50)"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tag">Tag (optional):</label>
        <input
          type="text"
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="e.g., love, life, inspiration"
        />
      </div>

      <button type="submit">Get Quotes</button>
    </form>
  );
}

export default QuoteForm; 