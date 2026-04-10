import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';

describe('KeyboardShortcuts', () => {
  it('renders the help button initially', () => {
    render(<KeyboardShortcuts />);
    const button = screen.getByLabelText('Show keyboard shortcuts');
    expect(button).toBeInTheDocument();
  });

  it('opens the shortcuts panel when clicking the button', () => {
    render(<KeyboardShortcuts />);
    const button = screen.getByLabelText('Show keyboard shortcuts');
    fireEvent.click(button);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Keyboard shortcuts/i }),
    ).toBeInTheDocument();
  });

  it('closes the panel when clicking the close button', () => {
    render(<KeyboardShortcuts />);
    const button = screen.getByLabelText('Show keyboard shortcuts');
    fireEvent.click(button);

    const closeButton = screen.getByLabelText('Close shortcuts panel');
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows shortcut descriptions', () => {
    render(<KeyboardShortcuts />);
    const button = screen.getByLabelText('Show keyboard shortcuts');
    fireEvent.click(button);

    expect(
      screen.getByText(/Subtract items in the exercise/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Toggle this shortcuts panel/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Toggle dark\/light theme/),
    ).toBeInTheDocument();
  });

  it('renders keyboard key elements', () => {
    render(<KeyboardShortcuts />);
    const button = screen.getByLabelText('Show keyboard shortcuts');
    fireEvent.click(button);

    // Find kbd elements by their text content
    const dialog = screen.getByRole('dialog');
    const keys = dialog.querySelectorAll('kbd');
    expect(keys.length).toBeGreaterThan(0);
  });
});
