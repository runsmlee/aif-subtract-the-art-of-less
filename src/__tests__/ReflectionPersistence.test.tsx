import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Reflection } from '../components/Reflection';

const STORAGE_KEY = 'subtract-reflections';

interface SavedReflection {
  id: string;
  promptText: string;
  reflectionText: string;
  savedAt: string;
}

describe('Reflection persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves reflection to localStorage on submit', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    fireEvent.click(prompts[0]);

    const textarea = screen.getByPlaceholderText('Write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'My saved thought' } });

    const submitButton = screen.getByText('Save Reflection');
    fireEvent.click(submitButton);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    const entries: SavedReflection[] = JSON.parse(stored!);
    expect(entries).toHaveLength(1);
    expect(entries[0].reflectionText).toBe('My saved thought');
    expect(entries[0].promptText).toBe(prompts[0].textContent);
    expect(entries[0].id).toBeDefined();
    expect(entries[0].savedAt).toBeDefined();
  });

  it('loads saved reflections from localStorage on mount', () => {
    // Use a unique prompt that won't collide with radio button prompts
    const savedData: SavedReflection[] = [
      {
        id: 'r-1',
        promptText: 'Unique test prompt that will never appear in radio buttons',
        reflectionText: 'I would have more time for deep work.',
        savedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    render(<Reflection />);

    // History is visible by default, so the toggle says "Hide reflections"
    expect(screen.getByText('Hide reflections')).toBeInTheDocument();
    expect(screen.getByText('I would have more time for deep work.')).toBeInTheDocument();
  });

  it('shows the last 5 saved reflections', () => {
    const savedData: SavedReflection[] = Array.from({ length: 7 }, (_, i) => ({
      id: `r-${i}`,
      promptText: `Unique prompt number ${i} for testing`,
      reflectionText: `Reflection ${i}`,
      savedAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    render(<Reflection />);

    // History is visible by default
    expect(screen.getByText('Hide reflections')).toBeInTheDocument();
    // Only 5 most recent should show (indices 0-4), not older ones
    expect(screen.getByText('Reflection 0')).toBeInTheDocument();
    expect(screen.getByText('Reflection 4')).toBeInTheDocument();
    expect(screen.queryByText('Reflection 5')).not.toBeInTheDocument();
  });

  it('does not show history toggle when empty', () => {
    render(<Reflection />);
    expect(screen.queryByText('View all reflections')).not.toBeInTheDocument();
    expect(screen.queryByText('Hide reflections')).not.toBeInTheDocument();
  });

  it('displays date as Today for same-day reflections', () => {
    const savedData: SavedReflection[] = [
      {
        id: 'r-1',
        promptText: 'Unique prompt for date test',
        reflectionText: 'Test reflection',
        savedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    render(<Reflection />);

    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('displays date as Yesterday for 1-day-old reflections', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const savedData: SavedReflection[] = [
      {
        id: 'r-1',
        promptText: 'Unique prompt for yesterday test',
        reflectionText: 'Test reflection',
        savedAt: yesterday,
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    render(<Reflection />);

    expect(screen.getByText('Yesterday')).toBeInTheDocument();
  });

  it('clears history with confirmation when Clear history is clicked', () => {
    const savedData: SavedReflection[] = [
      {
        id: 'r-1',
        promptText: 'Unique prompt for clear test',
        reflectionText: 'Test reflection to clear',
        savedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    render(<Reflection />);

    expect(screen.getByText('Hide reflections')).toBeInTheDocument();

    const clearButton = screen.getByText('Clear history');
    fireEvent.click(clearButton);

    // Confirmation should appear
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

    // Find the "Yes, clear all" button specifically
    const confirmButton = screen.getByRole('button', { name: /Yes, clear all/ });
    fireEvent.click(confirmButton);

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(screen.queryByText('Hide reflections')).not.toBeInTheDocument();
    expect(screen.queryByText('View all reflections')).not.toBeInTheDocument();
  });

  it('can dismiss clear confirmation', () => {
    const savedData: SavedReflection[] = [
      {
        id: 'r-1',
        promptText: 'Unique prompt for dismiss test',
        reflectionText: 'Test reflection to keep',
        savedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    render(<Reflection />);

    const clearButton = screen.getByText('Clear history');
    fireEvent.click(clearButton);

    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

    // Find the Cancel button within the confirmation dialog by its styling
    const allButtons = screen.getAllByRole('button');
    const cancelButton = allButtons.find(
      (btn) => btn.textContent === 'Cancel' && btn.className.includes('text-gray'),
    );
    expect(cancelButton).toBeTruthy();
    fireEvent.click(cancelButton!);

    expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();
    // Data should still be there
    expect(screen.getByText('Hide reflections')).toBeInTheDocument();
  });

  it('shows the saved prompt and reflection text in saved state', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    const promptText = prompts[0].textContent ?? '';
    fireEvent.click(prompts[0]);

    const textarea = screen.getByPlaceholderText('Write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'My deep thought' } });

    const submitButton = screen.getByText('Save Reflection');
    fireEvent.click(submitButton);

    // After submission, the prompt text appears in both the history panel and the saved state card.
    // Use getAllByText since it will appear in multiple places.
    const promptMatches = screen.getAllByText(promptText);
    expect(promptMatches.length).toBeGreaterThanOrEqual(1);
    // The reflection text also appears in both the history panel and the saved state card
    const reflectionMatches = screen.getAllByText('My deep thought');
    expect(reflectionMatches.length).toBeGreaterThanOrEqual(1);
  });

  it('has a Hide reflections toggle that collapses history panel', () => {
    const savedData: SavedReflection[] = [
      {
        id: 'r-1',
        promptText: 'Unique prompt for toggle test',
        reflectionText: 'Test reflection for toggle',
        savedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    render(<Reflection />);

    // History is visible by default, so toggle says "Hide reflections"
    expect(screen.getByText('Hide reflections')).toBeInTheDocument();
    expect(screen.getByText('Test reflection for toggle')).toBeInTheDocument();

    // Click to collapse
    const hideButton = screen.getByText('Hide reflections');
    fireEvent.click(hideButton);

    // After clicking, the toggle should now say "View all reflections"
    expect(screen.getByText('View all reflections')).toBeInTheDocument();
    // The reflection text should be hidden
    expect(screen.queryByText('Test reflection for toggle')).not.toBeInTheDocument();

    // Click to expand again
    const expandButton = screen.getByText('View all reflections');
    fireEvent.click(expandButton);

    expect(screen.getByText('Test reflection for toggle')).toBeInTheDocument();
  });
});
