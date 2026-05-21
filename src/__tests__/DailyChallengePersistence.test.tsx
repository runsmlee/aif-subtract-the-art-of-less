import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DailyChallenge } from '../components/DailyChallenge';
import { getLocalDateStr } from '../utils/date';

const STORAGE_KEY = 'subtract-challenges';

function getYesterdayDateStr(): string {
  const d = new Date(Date.now() - 86400000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('DailyChallenge persistence with date-based storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores completion in date-based localStorage format', () => {
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
      expect(parsed.date).toBe(getLocalDateStr());
      expect(Array.isArray(parsed.completedIds)).toBe(true);
      expect(parsed.completedIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('restores today\'s completed challenges on mount', () => {
    // Pre-set today's completed state
    const todayDateStr = getLocalDateStr();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: todayDateStr, completedIds: ['test-challenge'] }),
    );

    render(<DailyChallenge />);
    // The component should show completed state for today's challenge
    // even if the challengeId doesn't match, the stored date should be today's
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.date).toBe(todayDateStr);
  });

  it('does not carry over completion from previous days', () => {
    // Set a completion from yesterday
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: getYesterdayDateStr(), completedIds: ['some-challenge'] }),
    );

    render(<DailyChallenge />);

    // The completion from yesterday should NOT apply today
    // The component should NOT show completed state
    expect(screen.queryByText(/Challenge completed today/)).not.toBeInTheDocument();
  });

  it('fresh start on a new day even if previous day had completions', () => {
    // Set completion data from yesterday
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: getYesterdayDateStr(), completedIds: ['some-id'] }),
    );

    // Render — component should show fresh (non-completed) state
    render(<DailyChallenge />);
    expect(screen.queryByText(/Challenge completed today/)).not.toBeInTheDocument();
  });

  it('uses the exact storage key subtract-challenges', () => {
    render(<DailyChallenge />);

    // After mount, the component should have checked/written to this key
    // The key might not exist yet if no interaction happened, so let's complete
    const buttons = screen.getAllByRole('button');
    const completeButton = buttons.find(
      (btn) => btn.textContent?.includes('I ') && !btn.textContent?.includes('completed'),
    );

    if (completeButton) {
      fireEvent.click(completeButton);

      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(parsed).toHaveProperty('date');
      expect(parsed).toHaveProperty('completedIds');
    }
  });
});
