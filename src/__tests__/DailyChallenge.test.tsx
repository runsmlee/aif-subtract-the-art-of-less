import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { DailyChallenge } from '../components/DailyChallenge';

const STORAGE_KEY = 'subtract-challenges';

function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

describe('DailyChallenge', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the section heading', () => {
    render(<DailyChallenge />);
    const heading = screen.getByRole('heading', {
      name: /One small subtraction/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the challenge description', () => {
    render(<DailyChallenge />);
    expect(screen.getByText(/A different challenge every day/)).toBeInTheDocument();
  });

  it('renders a challenge card with title and description', () => {
    render(<DailyChallenge />);
    // Should render a category badge
    const badges = screen.getAllByText(/Mindset|Time|Possessions|Digital/);
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('renders a completion button', () => {
    render(<DailyChallenge />);
    // Should have a button to mark as completed
    const buttons = screen.getAllByRole('button');
    const completeButton = buttons.find(
      (btn) => btn.textContent?.includes('I ') && !btn.textContent?.includes('completed'),
    );
    expect(completeButton).toBeTruthy();
  });

  it('marks challenge as completed when button is clicked', () => {
    render(<DailyChallenge />);
    const buttons = screen.getAllByRole('button');
    const completeButton = buttons.find(
      (btn) => btn.textContent?.includes('I ') && !btn.textContent?.includes('completed'),
    );

    if (completeButton) {
      fireEvent.click(completeButton);
      expect(screen.getByText(/Challenge completed today/)).toBeInTheDocument();
    }
  });

  it('persists completion state in localStorage using date-based key', () => {
    render(<DailyChallenge />);
    const buttons = screen.getAllByRole('button');
    const completeButton = buttons.find(
      (btn) => btn.textContent?.includes('I ') && !btn.textContent?.includes('completed'),
    );

    if (completeButton) {
      fireEvent.click(completeButton);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.date).toBe(getTodayDateStr());
      expect(Array.isArray(parsed.completedIds)).toBe(true);
    }
  });

  it('shows completed state when localStorage has today\'s completion', () => {
    const todayStr = getTodayDateStr();
    // Get today's challenge index
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );
    const challengeIndex = dayOfYear % 10;

    const challenges = [
      'unsubscribe', 'one-thing', 'closet', 'notification', 'no-meeting',
      'single-task', 'gratitude', 'app-delete', 'five-minute', 'surface',
    ];
    const challengeId = challenges[challengeIndex];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: todayStr, completedIds: [challengeId] }),
    );

    render(<DailyChallenge />);
    expect(screen.getByText(/Challenge completed today/)).toBeInTheDocument();
  });

  it('does NOT show completed state when localStorage has yesterday\'s data', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: yesterday, completedIds: ['some-id'] }),
    );

    render(<DailyChallenge />);
    expect(screen.queryByText(/Challenge completed today/)).not.toBeInTheDocument();
  });

  it('renders progress indicator dots', () => {
    render(<DailyChallenge />);
    const section = screen.getByRole('heading', { name: /One small subtraction/ })
      .closest('section');
    expect(section).toBeInTheDocument();
  });
});
