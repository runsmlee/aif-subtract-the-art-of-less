import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Principles } from '../components/Principles';

describe('Principles', () => {
  it('renders the section heading', () => {
    render(<Principles />);
    const heading = screen.getByRole('heading', {
      name: /Four principles of less/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders all four principles', () => {
    render(<Principles />);
    expect(screen.getByText("Remove, don't add")).toBeInTheDocument();
    expect(screen.getByText('Find the essential')).toBeInTheDocument();
    expect(screen.getByText('Clarity through constraint')).toBeInTheDocument();
    expect(screen.getByText('Value the space between')).toBeInTheDocument();
  });

  it('renders principle descriptions', () => {
    render(<Principles />);
    const descriptions = screen.getAllByText(/Subtraction is the undervalued|Strip away|don.t limit creativity|silence defines melody/);
    expect(descriptions).toHaveLength(4);
  });
});
