import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuoteList from '../QuoteList';

describe('QuoteList', () => {
  const mockQuotes = [
    {
      id: 1,
      text: 'Test quote 1',
      author: 'Author 1',
      tags: ['love', 'life']
    },
    {
      id: 2,
      text: 'Test quote 2',
      author: 'Author 2',
      tags: ['inspiration']
    }
  ];

  it('renders nothing when quotes array is empty', () => {
    const { container } = render(<QuoteList quotes={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders quotes correctly', () => {
    render(<QuoteList quotes={mockQuotes} />);
    
    // Check if quotes are rendered
    expect(screen.getByText('Test quote 1')).toBeInTheDocument();
    expect(screen.getByText('Test quote 2')).toBeInTheDocument();
    
    // Check if authors are rendered
    expect(screen.getByText('— Author 1')).toBeInTheDocument();
    expect(screen.getByText('— Author 2')).toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    render(<QuoteList quotes={mockQuotes} />);
    
    // Check if tags are rendered
    expect(screen.getByText('love')).toBeInTheDocument();
    expect(screen.getByText('life')).toBeInTheDocument();
    expect(screen.getByText('inspiration')).toBeInTheDocument();
  });

  it('handles quotes without tags', () => {
    const quotesWithoutTags = [
      {
        id: 1,
        text: 'Quote without tags',
        author: 'Author',
        tags: []
      }
    ];

    render(<QuoteList quotes={quotesWithoutTags} />);
    
    // Quote and author should be rendered
    expect(screen.getByText('Quote without tags')).toBeInTheDocument();
    expect(screen.getByText('— Author')).toBeInTheDocument();
    
    // No tags should be rendered
    const quoteCard = screen.getByText('Quote without tags').closest('.quote-card');
    expect(quoteCard.querySelector('.quote-tags')).toBeNull();
  });

  it('applies correct CSS classes', () => {
    render(<QuoteList quotes={mockQuotes} />);
    
    // Check if main container has correct class
    expect(screen.getByText('Test quote 1').closest('.quote-list')).toBeInTheDocument();
    
    // Check if quote cards have correct classes
    const quoteCards = document.querySelectorAll('.quote-card');
    expect(quoteCards).toHaveLength(2);
    
    // Check if quote text has correct class
    expect(document.querySelectorAll('.quote-text')).toHaveLength(2);
    
    // Check if tags have correct class
    expect(document.querySelectorAll('.tag')).toHaveLength(3);
  });
}); 