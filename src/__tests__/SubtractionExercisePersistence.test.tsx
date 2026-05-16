import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SubtractionExercise } from '../components/SubtractionExercise';

const STORAGE_KEY = 'subtract-exercise';

describe('SubtractionExercise persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves removed item IDs to localStorage when items are subtracted', () => {
    render(<SubtractionExercise />);

    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toContain('meetings');
  });

  it('restores removed state from localStorage on mount', () => {
    // Pre-set removed items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['meetings', 'notifications']));

    render(<SubtractionExercise />);

    // "Unnecessary meetings" should have line-through (removed)
    const meetingsText = screen.getByText('Unnecessary meetings');
    expect(meetingsText).toHaveClass('line-through');

    // "Endless notifications" should also have line-through
    const notificationsText = screen.getByText('Endless notifications');
    expect(notificationsText).toHaveClass('line-through');

    // "Unused features" should NOT have line-through (not removed)
    const featuresText = screen.getByText('Unused features');
    expect(featuresText).not.toHaveClass('line-through');
  });

  it('updates localStorage when additional items are subtracted', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['meetings']));

    render(<SubtractionExercise />);

    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    // The first non-removed subtract button
    fireEvent.click(subtractButtons[0]);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.length).toBeGreaterThanOrEqual(2);
  });

  it('clears localStorage when exercise is reset', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['meetings', 'notifications']));

    render(<SubtractionExercise />);

    const resetButton = screen.getByRole('button', { name: /Reset exercise/i });
    fireEvent.click(resetButton);

    const stored = localStorage.getItem(STORAGE_KEY);
    // Should be empty array or null after reset
    if (stored) {
      expect(JSON.parse(stored)).toHaveLength(0);
    } else {
      expect(stored).toBeNull();
    }
  });

  it('saves custom items to localStorage', () => {
    render(<SubtractionExercise />);

    const input = screen.getByPlaceholderText('Add your own item to subtract...');
    fireEvent.change(input, { target: { value: 'My custom item' } });
    const addButton = screen.getByLabelText('Add custom item');
    fireEvent.click(addButton);

    // Now subtract the custom item
    const customSubtractBtn = screen.getByRole('button', {
      name: /Subtract My custom item/,
    });
    fireEvent.click(customSubtractBtn);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toContain('custom-1');
  });

  it('restores progress bar state from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['meetings', 'notifications', 'features']));

    render(<SubtractionExercise />);

    const progressbar = screen.getByRole('progressbar');
    // 3 out of 8 removed = 38% (Math.round(37.5))
    expect(progressbar).toHaveAttribute('aria-valuenow', '38');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');

    render(<SubtractionExercise />);

    // Should render normally without crashing
    const heading = screen.getByRole('heading', {
      name: /Subtract what weighs you down/i,
    });
    expect(heading).toBeInTheDocument();

    // All items should be in non-removed state
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(8);
  });

  it('handles non-array localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: true }));

    render(<SubtractionExercise />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(8);
  });
});
