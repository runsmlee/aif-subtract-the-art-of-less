import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SubtractionExercise } from '../components/SubtractionExercise';

describe('SubtractionExercise', () => {
  it('renders the exercise heading', () => {
    render(<SubtractionExercise />);
    const heading = screen.getByRole('heading', {
      name: /Subtract what weighs you down/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders all clutter items', () => {
    render(<SubtractionExercise />);
    const list = screen.getByRole('list', { name: 'Items to subtract' });
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(8);
  });

  it('marks an item as removed when subtract button is clicked', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    expect(subtractButtons.length).toBeGreaterThan(0);

    fireEvent.click(subtractButtons[0]);

    // The item text should now have strikethrough
    const itemText = screen.getByText('Unnecessary meetings');
    expect(itemText).toHaveClass('line-through');
  });

  it('shows restore button for removed items', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);

    const restoreButton = screen.getByRole('button', {
      name: /Restore Unnecessary meetings/i,
    });
    expect(restoreButton).toBeInTheDocument();
  });

  it('restores an item when restore button is clicked', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);

    const restoreButton = screen.getByRole('button', {
      name: /Restore Unnecessary meetings/i,
    });
    fireEvent.click(restoreButton);

    const itemText = screen.getByText('Unnecessary meetings');
    expect(itemText).not.toHaveClass('line-through');
  });

  it('shows completion message when all items are removed', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    subtractButtons.forEach((button) => fireEvent.click(button));

    const statusMessage = screen.getByRole('status');
    expect(statusMessage).toBeInTheDocument();
    expect(statusMessage.textContent).toContain(
      "You've subtracted everything",
    );
  });

  it('shows reset button after removing items', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);

    const resetButton = screen.getByRole('button', {
      name: /Reset exercise/i,
    });
    expect(resetButton).toBeInTheDocument();
  });

  it('resets all items when reset button is clicked', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);
    fireEvent.click(subtractButtons[1]);

    const resetButton = screen.getByRole('button', {
      name: /Reset exercise/i,
    });
    fireEvent.click(resetButton);

    // All subtract buttons should be back
    const allSubtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    expect(allSubtractButtons).toHaveLength(8);
  });
});
