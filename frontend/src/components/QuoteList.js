import React from 'react';
import './QuoteList.css';

function QuoteList({ quotes }) {
  if (!quotes.length) {
    return null;
  }

  return (
    <div className="quote-list">
      {quotes.map((quote) => (
        <div key={quote.id} className="quote-card">
          <blockquote className="quote-text">{quote.text}</blockquote>
          <div className="quote-author">— {quote.author}</div>
          {quote.tags && quote.tags.length > 0 && (
            <div className="quote-tags">
              {quote.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default QuoteList; 