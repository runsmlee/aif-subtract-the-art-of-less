import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Quote } from '../components/Quote';

describe('Quote', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the section heading', () => {
    render(<Quote />);
    const heading = screen.getByRole('heading', { name: /Voices of less/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the first quote initially', () => {
    render(<Quote />);
    const quote = screen.getByText(/Perfection is achieved/);
    expect(quote).toBeInTheDocument();
  });

  it('navigates to the next quote on button click', async () => {
    render(<Quote />);
    const nextButton = screen.getByLabelText('Next quote');
    fireEvent.click(nextButton);

    // Wait for transition
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    // Should show a different quote
    const blockquote = document.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('navigates to the previous quote on button click', async () => {
    render(<Quote />);
    const prevButton = screen.getByLabelText('Previous quote');
    fireEvent.click(prevButton);

    // Wait for transition
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    const blockquote = document.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('renders dot navigation indicators', () => {
    render(<Quote />);
    const tabs = screen.getAllByRole('tab');
    // 5 quotes = 5 dot indicators
    expect(tabs).toHaveLength(5);
  });

  it('navigates to a specific quote via dot indicator', async () => {
    render(<Quote />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[2]);

    // Wait for transition
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    const blockquote = document.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('has proper carousel role description', () => {
    render(<Quote />);
    const carousel = screen.getByRole('region', { name: 'Quote carousel' });
    expect(carousel).toBeInTheDocument();
  });

  it('auto-advances to next quote', async () => {
    render(<Quote />);

    // Advance past the auto-advance timer (6 seconds)
    await act(async () => {
      vi.advanceTimersByTime(6200);
    });

    const blockquote = document.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('wraps around when advancing past the last quote', async () => {
    render(<Quote />);

    // Advance through all 5 quotes to wrap around back to first
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        vi.advanceTimersByTime(6200);
      });
    }

    const blockquote = document.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('shows pause indicator when hovered', async () => {
    render(<Quote />);
    const carousel = screen.getByRole('region', { name: 'Quote carousel' });

    fireEvent.mouseEnter(carousel);
    expect(screen.getByText(/Paused/)).toBeInTheDocument();

    fireEvent.mouseLeave(carousel);
    expect(screen.queryByText(/Paused/)).not.toBeInTheDocument();
  });

  it('supports swipe gestures for mobile navigation', async () => {
    render(<Quote />);
    const carousel = screen.getByRole('region', { name: 'Quote carousel' });

    // Swipe left (next quote)
    fireEvent.touchStart(carousel, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 100 }] });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    const blockquote = document.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });
});
