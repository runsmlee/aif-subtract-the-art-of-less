import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MindfulBreak } from '../components/MindfulBreak';

describe('MindfulBreak', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the section heading', () => {
    render(<MindfulBreak />);
    const heading = screen.getByRole('heading', { name: /A mindful minute/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the subtitle description', () => {
    render(<MindfulBreak />);
    expect(screen.getByText(/Three cycles of breathing/)).toBeInTheDocument();
  });

  it('shows Begin Breathing button initially', () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    expect(startButton).toBeInTheDocument();
  });

  it('starts the breathing exercise on button click', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });

    fireEvent.click(startButton);

    // Should show Pause button instead of Begin
    expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Begin Breathing/i })).not.toBeInTheDocument();
  });

  it('shows inhale phase label after starting', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Should show inhale instruction
    expect(screen.getByText('Slowly draw breath in')).toBeInTheDocument();
  });

  it('shows cycle indicators', () => {
    render(<MindfulBreak />);
    expect(screen.getByText('Cycle 1')).toBeInTheDocument();
    expect(screen.getByText('Cycle 2')).toBeInTheDocument();
    expect(screen.getByText('Cycle 3')).toBeInTheDocument();
  });

  it('transitions from inhale to hold phase', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Advance past inhale duration (4 seconds)
    await act(async () => {
      vi.advanceTimersByTime(4200);
    });

    expect(screen.getByText('Rest in stillness')).toBeInTheDocument();
  });

  it('transitions from hold to exhale phase', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Advance past inhale + hold (4 + 4 = 8 seconds)
    await act(async () => {
      vi.advanceTimersByTime(8200);
    });

    expect(screen.getByText('Let everything go')).toBeInTheDocument();
  });

  it('completes a full cycle and moves to next', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Complete one full cycle: inhale(4s) + hold(4s) + exhale(6s) = 14s
    await act(async () => {
      vi.advanceTimersByTime(14200);
    });

    // Should be on cycle 2 now, showing inhale
    expect(screen.getByText('Slowly draw breath in')).toBeInTheDocument();
  });

  it('completes all three cycles', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Complete all 3 cycles: 14s * 3 = 42s
    await act(async () => {
      vi.advanceTimersByTime(42500);
    });

    expect(screen.getByText(/Space created/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Breathe Again/i })).toBeInTheDocument();
  });

  it('can be stopped during exercise', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    const pauseButton = screen.getByRole('button', { name: /Pause/i });
    fireEvent.click(pauseButton);

    expect(screen.getByRole('button', { name: /Begin Breathing/i })).toBeInTheDocument();
  });

  it('can restart after completion', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Complete all 3 cycles
    await act(async () => {
      vi.advanceTimersByTime(42500);
    });

    const restartButton = screen.getByRole('button', { name: /Breathe Again/i });
    fireEvent.click(restartButton);

    expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument();
  });

  it('renders session stats', () => {
    render(<MindfulBreak />);
    expect(screen.getByText('Sessions today')).toBeInTheDocument();
    expect(screen.getByText('Total sessions')).toBeInTheDocument();
  });

  it('persists completed sessions to localStorage', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Complete all 3 cycles
    await act(async () => {
      vi.advanceTimersByTime(42500);
    });

    // Check localStorage was updated
    const stored = localStorage.getItem('subtract-mindful-sessions');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].cycles).toBe(3);
  });

  it('updates session count after completion', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    // Complete all 3 cycles
    await act(async () => {
      vi.advanceTimersByTime(42500);
    });

    // The session stats should show 1 for today and 1 for total
    expect(screen.getByText('Sessions today')).toBeInTheDocument();
    expect(screen.getByText('Total sessions')).toBeInTheDocument();
  });

  it('shows progress bar during exercise', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    const progressbar = screen.getByRole('progressbar', { name: /Overall breathing exercise progress/i });
    expect(progressbar).toBeInTheDocument();
  });

  it('shows insight text after completion', async () => {
    render(<MindfulBreak />);
    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    await act(async () => {
      vi.advanceTimersByTime(42500);
    });

    expect(screen.getByText(/The space between thoughts/)).toBeInTheDocument();
  });

  it('has accessible labels for the breathing indicator', async () => {
    render(<MindfulBreak />);
    const indicator = screen.getByRole('img', { name: /Ready to begin/i });
    expect(indicator).toBeInTheDocument();

    const startButton = screen.getByRole('button', { name: /Begin Breathing/i });
    fireEvent.click(startButton);

    const activeIndicator = screen.getByRole('img', { name: /Phase: Breathe In/i });
    expect(activeIndicator).toBeInTheDocument();
  });
});
