import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuoteForm from '../QuoteForm';

describe('QuoteForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form elements correctly', () => {
    render(<QuoteForm onSubmit={mockOnSubmit} />);
    
    // Check if all form elements are present
    expect(screen.getByLabelText(/number of quotes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get quotes/i })).toBeInTheDocument();
  });

  it('handles valid input submission', () => {
    render(<QuoteForm onSubmit={mockOnSubmit} />);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText(/number of quotes/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/tag/i), { target: { value: 'love' } });
    
    // Submit form
    fireEvent.submit(screen.getByRole('form'));
    
    // Check if onSubmit was called with correct values
    expect(mockOnSubmit).toHaveBeenCalledWith('10', 'love');
  });

  it('trims tag value on submission', () => {
    render(<QuoteForm onSubmit={mockOnSubmit} />);
    
    // Fill in form with spaces in tag
    fireEvent.change(screen.getByLabelText(/number of quotes/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/tag/i), { target: { value: '  inspiration  ' } });
    
    // Submit form
    fireEvent.submit(screen.getByRole('form'));
    
    // Check if onSubmit was called with trimmed tag
    expect(mockOnSubmit).toHaveBeenCalledWith('5', 'inspiration');
  });

  it('allows empty tag submission', () => {
    render(<QuoteForm onSubmit={mockOnSubmit} />);
    
    // Fill in only count
    fireEvent.change(screen.getByLabelText(/number of quotes/i), { target: { value: '15' } });
    
    // Submit form
    fireEvent.submit(screen.getByRole('form'));
    
    // Check if onSubmit was called with empty tag
    expect(mockOnSubmit).toHaveBeenCalledWith('15', '');
  });
}); 