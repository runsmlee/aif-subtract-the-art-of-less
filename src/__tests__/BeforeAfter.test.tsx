import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BeforeAfter } from '../components/BeforeAfter';

describe('BeforeAfter', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('renders the section heading', () => {
    render(<BeforeAfter />);
    const heading = screen.getByRole('heading', {
      name: /Before subtraction, after clarity/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders all four comparison cards', () => {
    render(<BeforeAfter />);
    const buttons = screen.getAllByRole('button');
    // 4 comparison cards + reveal all button
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('reveals a card when clicked', () => {
    render(<BeforeAfter />);
    const card = screen.getByLabelText(/Reveal: 10 decorative elements/);
    fireEvent.click(card);

    // After revealing, it should show the "after" state
    expect(screen.getByText('1 clear message')).toBeInTheDocument();
  });

  it('shows reveal all button', () => {
    render(<BeforeAfter />);
    const revealAll = screen.getByText('Reveal all at once');
    expect(revealAll).toBeInTheDocument();
  });

  it('reveals all cards when reveal all is clicked', () => {
    render(<BeforeAfter />);
    const revealAll = screen.getByText('Reveal all at once');
    fireEvent.click(revealAll);

    expect(screen.getByText('1 clear message')).toBeInTheDocument();
    expect(screen.getByText('3 meaningful conversations')).toBeInTheDocument();
    expect(screen.getByText('3 outcomes that matter')).toBeInTheDocument();
    expect(screen.getByText('5 requiring action')).toBeInTheDocument();
  });

  it('shows conclusion after all revealed', () => {
    render(<BeforeAfter />);
    const revealAll = screen.getByText('Reveal all at once');
    fireEvent.click(revealAll);

    expect(screen.getByText(/Every subtraction reveals something more valuable/)).toBeInTheDocument();
  });

  it('renders the see the difference label', () => {
    render(<BeforeAfter />);
    expect(screen.getByText('See the difference')).toBeInTheDocument();
  });
});
