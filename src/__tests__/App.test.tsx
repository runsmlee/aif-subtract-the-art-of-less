import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from '../App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Subtract everything');
  });

  it('renders the brand name in the header', () => {
    render(<App />);
    const brandLink = screen.getByLabelText('Subtract — Home');
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.textContent).toBe('Subtract');
  });

  it('renders the footer with copyright', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders the principles section', () => {
    render(<App />);
    const principlesHeading = screen.getByRole('heading', {
      name: /Four principles of less/i,
    });
    expect(principlesHeading).toBeInTheDocument();
  });

  it('renders the practice section', () => {
    render(<App />);
    const practiceHeading = screen.getByRole('heading', {
      name: /Subtract what weighs you down/i,
    });
    expect(practiceHeading).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });
});
