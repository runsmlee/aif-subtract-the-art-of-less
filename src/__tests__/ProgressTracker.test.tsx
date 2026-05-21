import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressTracker } from '../components/ProgressTracker';
import { getLocalDateStr } from '../utils/date';

describe('ProgressTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the progress section heading', () => {
    render(<ProgressTracker />);
    const heading = screen.getByRole('heading', {
      name: /Your journey/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders all progress categories', () => {
    render(<ProgressTracker />);
    expect(screen.getByText(/Items subtracted/)).toBeInTheDocument();
    expect(screen.getByText(/Before & After/)).toBeInTheDocument();
    expect(screen.getByText(/Journal entries/)).toBeInTheDocument();
    expect(screen.getByText(/Reflections/)).toBeInTheDocument();
    expect(screen.getByText(/Mindful breaks/)).toBeInTheDocument();
  });

  it('shows zero state when no data exists', () => {
    render(<ProgressTracker />);
    // Should show zeros or dashes for all categories
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(1);
  });

  it('reads exercise progress from localStorage', () => {
    localStorage.setItem('subtract-exercise', JSON.stringify(['meetings', 'notifications']));

    render(<ProgressTracker />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('reads BeforeAfter progress from localStorage', () => {
    localStorage.setItem('subtract-beforeafter', JSON.stringify(['design', 'schedule']));

    render(<ProgressTracker />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('reads journal entries from localStorage', () => {
    const entries = [
      { id: 'j-1', text: 'test', date: '2024-01-01', createdAt: 1000 },
      { id: 'j-2', text: 'test2', date: '2024-01-02', createdAt: 2000 },
      { id: 'j-3', text: 'test3', date: '2024-01-03', createdAt: 3000 },
    ];
    localStorage.setItem('subtract-journal', JSON.stringify(entries));

    render(<ProgressTracker />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('reads reflections from localStorage', () => {
    const reflections = [
      { id: 'r-1', promptText: 'p1', reflectionText: 't1', savedAt: '2024-01-01' },
    ];
    localStorage.setItem('subtract-reflections', JSON.stringify(reflections));

    render(<ProgressTracker />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders with accessible landmark', () => {
    render(<ProgressTracker />);
    const section = screen.getByRole('region', { name: /Progress overview/i });
    expect(section).toBeInTheDocument();
  });

  it('handles corrupted localStorage data gracefully', () => {
    localStorage.setItem('subtract-exercise', 'not-json');
    localStorage.setItem('subtract-journal', 'bad-data');
    localStorage.setItem('subtract-reflections', '{invalid}');
    localStorage.setItem('subtract-beforeafter', '12345');

    render(<ProgressTracker />);
    // Should render without crashing
    const heading = screen.getByRole('heading', { name: /Your journey/i });
    expect(heading).toBeInTheDocument();
  });

  it('shows completion badge when all items are subtracted', () => {
    localStorage.setItem(
      'subtract-exercise',
      JSON.stringify(['meetings', 'notifications', 'features', 'multitasking', 'perfectionism', 'busywork', 'comparisons', 'assumptions']),
    );

    render(<ProgressTracker />);
    expect(screen.getByText(/Complete/)).toBeInTheDocument();
  });

  it('shows challenge completion status', () => {
    const todayStr = getLocalDateStr();
    localStorage.setItem(
      'subtract-challenges',
      JSON.stringify({ date: todayStr, completedIds: ['test-id'] }),
    );

    render(<ProgressTracker />);
    expect(screen.getByText(/Today's challenge/)).toBeInTheDocument();
  });
});
