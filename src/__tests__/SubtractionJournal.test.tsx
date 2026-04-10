import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SubtractionJournal } from '../components/SubtractionJournal';

describe('SubtractionJournal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the journal heading', () => {
    render(<SubtractionJournal />);
    const heading = screen.getByRole('heading', {
      name: /Your subtraction log/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the input field', () => {
    render(<SubtractionJournal />);
    const input = screen.getByLabelText('What did you subtract today?');
    expect(input).toBeInTheDocument();
  });

  it('renders empty state when no entries exist', () => {
    render(<SubtractionJournal />);
    expect(
      screen.getByText(/Your journal is empty/),
    ).toBeInTheDocument();
  });

  it('adds a new entry when typing and pressing Enter', () => {
    render(<SubtractionJournal />);
    const input = screen.getByLabelText('What did you subtract today?');

    fireEvent.change(input, { target: { value: 'Unnecessary meetings' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Unnecessary meetings')).toBeInTheDocument();
    // "Today" appears multiple times (stats + entry date), use getAllByText
    expect(screen.getAllByText('Today').length).toBeGreaterThanOrEqual(2);
  });

  it('adds entry when clicking the add button', () => {
    render(<SubtractionJournal />);
    const input = screen.getByLabelText('What did you subtract today?');

    fireEvent.change(input, { target: { value: 'Social media scrolling' } });

    const addButton = screen.getByLabelText('Add journal entry');
    fireEvent.click(addButton);

    expect(screen.getByText('Social media scrolling')).toBeInTheDocument();
  });

  it('does not add empty entries', () => {
    render(<SubtractionJournal />);
    const addButton = screen.getByLabelText('Add journal entry');
    expect(addButton).toBeDisabled();
  });

  it('shows total subtractions count in stats', () => {
    render(<SubtractionJournal />);
    expect(screen.getByText('Total subtractions')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Day streak')).toBeInTheDocument();
  });

  it('deletes an entry when clicking delete', () => {
    render(<SubtractionJournal />);
    const input = screen.getByLabelText('What did you subtract today?');

    fireEvent.change(input, { target: { value: 'Test entry' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Test entry')).toBeInTheDocument();

    const deleteButton = screen.getByLabelText('Delete entry: Test entry');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Test entry')).not.toBeInTheDocument();
  });

  it('shows filter tabs when entries exist', () => {
    render(<SubtractionJournal />);
    const input = screen.getByLabelText('What did you subtract today?');

    fireEvent.change(input, { target: { value: 'Test entry' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByRole('tab', { name: /All \(1\)/ })).toBeInTheDocument();
  });

  it('persists entries in localStorage', () => {
    const { unmount } = render(<SubtractionJournal />);
    const input = screen.getByLabelText('What did you subtract today?');

    fireEvent.change(input, { target: { value: 'Persisted entry' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    unmount();

    render(<SubtractionJournal />);
    expect(screen.getByText('Persisted entry')).toBeInTheDocument();
  });

  it('clears all entries when clicking clear button', () => {
    render(<SubtractionJournal />);
    const input = screen.getByLabelText('What did you subtract today?');

    fireEvent.change(input, { target: { value: 'Entry one' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    const clearButton = screen.getByText('Clear all entries');
    fireEvent.click(clearButton);

    expect(screen.queryByText('Entry one')).not.toBeInTheDocument();
    expect(
      screen.getByText(/Your journal is empty/),
    ).toBeInTheDocument();
  });
});
