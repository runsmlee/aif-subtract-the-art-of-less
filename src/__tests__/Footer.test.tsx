import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../components/Footer';

describe('Footer', () => {
  it('renders the footer with proper role', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders the brand name', () => {
    render(<Footer />);
    const brand = screen.getByText('Subtract');
    expect(brand).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Footer />);
    const tagline = screen.getByText('The Art of Less');
    expect(tagline).toBeInTheDocument();
  });

  it('renders footer navigation', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Footer navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Principles')).toBeInTheDocument();
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getByText('Reflect')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
  });

  it('renders one of the rotating taglines', () => {
    render(<Footer />);
    const taglines = [
      'Less is more.',
      'Simplicity is the ultimate sophistication.',
      'What remains when everything unnecessary is gone?',
      'Subtract to reveal.',
      'Clarity through reduction.',
    ];
    // At least one tagline should be rendered (as italic text)
    const footer = screen.getByRole('contentinfo');
    const hasTagline = taglines.some((t) => footer.textContent?.includes(t));
    expect(hasTagline).toBe(true);
  });
});
