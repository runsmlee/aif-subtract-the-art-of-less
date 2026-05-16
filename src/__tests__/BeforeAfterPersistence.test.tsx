import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BeforeAfter } from '../components/BeforeAfter';

const STORAGE_KEY = 'subtract-beforeafter';

describe('BeforeAfter persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves revealed card IDs to localStorage when cards are revealed', () => {
    render(<BeforeAfter />);

    const card = screen.getByLabelText(/Reveal: 10 decorative elements/);
    fireEvent.click(card);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toContain('design');
  });

  it('restores revealed state from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['design', 'schedule']));

    render(<BeforeAfter />);

    // Revealed cards show "after" text
    expect(screen.getByText('1 clear message')).toBeInTheDocument();
    expect(screen.getByText('3 meaningful conversations')).toBeInTheDocument();

    // Unrevealed cards still show "before" text with "Reveal" label
    expect(screen.getByLabelText(/Reveal: 25 priorities for Q4/)).toBeInTheDocument();
  });

  it('shows conclusion when all cards are restored from localStorage', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(['design', 'schedule', 'goals', 'inbox']),
    );

    render(<BeforeAfter />);

    expect(
      screen.getByText(/Every subtraction reveals something more valuable/),
    ).toBeInTheDocument();
  });

  it('shows progress indicator reflecting restored state', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['design']));

    render(<BeforeAfter />);

    // 1/4 revealed
    expect(screen.getByText('1/4')).toBeInTheDocument();
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');

    render(<BeforeAfter />);

    // Should render normally
    const heading = screen.getByRole('heading', {
      name: /Before subtraction, after clarity/i,
    });
    expect(heading).toBeInTheDocument();

    // All 4 cards should be in unrevealed state
    expect(screen.getByText('Reveal all at once')).toBeInTheDocument();
  });

  it('handles non-array localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: true }));

    render(<BeforeAfter />);

    expect(screen.getByText('Reveal all at once')).toBeInTheDocument();
  });

  it('removes stored data when new session starts fresh (no stale data)', () => {
    // Set IDs that don't exist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['nonexistent']));

    render(<BeforeAfter />);

    // The nonexistent ID should be filtered out on load,
    // resulting in either null (removed) or empty array
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed).not.toContain('nonexistent');
    } else {
      expect(stored).toBeNull();
    }
  });
});
