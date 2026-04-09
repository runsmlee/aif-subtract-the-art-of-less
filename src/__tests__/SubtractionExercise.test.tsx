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

    const completionText = screen.getByText(/You've subtracted everything/);
    expect(completionText).toBeInTheDocument();
  });

  it('shows stats in completion celebration', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    subtractButtons.forEach((button) => fireEvent.click(button));

    expect(screen.getByText('Items removed')).toBeInTheDocument();
    expect(screen.getByText('Clarity gained')).toBeInTheDocument();
    expect(screen.getByText('Potential unlocked')).toBeInTheDocument();
  });

  it('shows share button in completion celebration', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    subtractButtons.forEach((button) => fireEvent.click(button));

    expect(screen.getByText('Share Score')).toBeInTheDocument();
  });

  it('shows reset button after removing items', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);

    const resetButtons = screen.getAllByRole('button', {
      name: /Reset exercise|Start Over/i,
    });
    expect(resetButtons.length).toBeGreaterThanOrEqual(1);
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

    const allSubtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    expect(allSubtractButtons).toHaveLength(8);
  });

  it('renders the custom item input', () => {
    render(<SubtractionExercise />);
    const input = screen.getByPlaceholderText(
      'Add your own item to subtract...',
    );
    expect(input).toBeInTheDocument();
  });

  it('adds a custom item when the add button is clicked', () => {
    render(<SubtractionExercise />);
    const input = screen.getByPlaceholderText(
      'Add your own item to subtract...',
    );

    fireEvent.change(input, { target: { value: 'My custom clutter' } });
    const addButton = screen.getByLabelText('Add custom item');
    fireEvent.click(addButton);

    expect(screen.getByText('My custom clutter')).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(9);
  });

  it('adds a custom item on Enter key press', () => {
    render(<SubtractionExercise />);
    const input = screen.getByPlaceholderText(
      'Add your own item to subtract...',
    );

    fireEvent.change(input, { target: { value: 'Keyboard item' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Keyboard item')).toBeInTheDocument();
  });

  it('does not add empty custom items', () => {
    render(<SubtractionExercise />);
    const addButton = screen.getByLabelText('Add custom item');

    fireEvent.click(addButton);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(8);
  });

  it('updates progress bar when items are removed', () => {
    render(<SubtractionExercise />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');

    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);

    expect(progressbar).toHaveAttribute('aria-valuenow', '13');
  });

  it('shows toast notification when item is subtracted', () => {
    render(<SubtractionExercise />);
    const subtractButtons = screen.getAllByRole('button', {
      name: /^Subtract/,
    });
    fireEvent.click(subtractButtons[0]);

    // Toast should appear with the item label
    const toast = screen.getByText(/Subtracted: Unnecessary meetings/);
    expect(toast).toBeInTheDocument();
  });

  it('renders keyboard shortcut tip', () => {
    render(<SubtractionExercise />);
    const tip = screen.getByText(/Press 1-9 to subtract by keyboard/);
    expect(tip).toBeInTheDocument();
  });
});
