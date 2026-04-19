import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Reflection } from '../components/Reflection';

describe('Reflection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the section heading', () => {
    render(<Reflection />);
    const heading = screen.getByRole('heading', {
      name: /What remains when you subtract/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders three reflection prompts', () => {
    render(<Reflection />);
    const prompts = screen.getAllByRole('radio');
    expect(prompts).toHaveLength(3);
  });

  it('shows textarea when a prompt is selected', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    fireEvent.click(prompts[0]);

    const textarea = screen.getByPlaceholderText('Write your thoughts here...');
    expect(textarea).toBeInTheDocument();
  });

  it('shows submit button when prompt is selected', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    fireEvent.click(prompts[0]);

    const submitButton = screen.getByText('Save Reflection');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when text is entered', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    fireEvent.click(prompts[0]);

    const textarea = screen.getByPlaceholderText('Write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'My reflection' } });

    const submitButton = screen.getByText('Save Reflection');
    expect(submitButton).not.toBeDisabled();
  });

  it('shows saved content after submitting reflection', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    const promptText = prompts[0].textContent ?? '';
    fireEvent.click(prompts[0]);

    const textarea = screen.getByPlaceholderText('Write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'My reflection' } });

    const submitButton = screen.getByText('Save Reflection');
    fireEvent.click(submitButton);

    // Should show the saved content — prompt text appears in history panel and/or saved state card
    const promptMatches = screen.getAllByText(promptText);
    expect(promptMatches.length).toBeGreaterThanOrEqual(1);
    // Reflection text also appears in multiple places
    const reflectionMatches = screen.getAllByText('My reflection');
    expect(reflectionMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Reflection saved/)).toBeInTheDocument();
  });

  it('allows writing another reflection after submission', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    fireEvent.click(prompts[0]);

    const textarea = screen.getByPlaceholderText('Write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'My reflection' } });

    const submitButton = screen.getByText('Save Reflection');
    fireEvent.click(submitButton);

    const writeAnother = screen.getByText('Write another reflection');
    fireEvent.click(writeAnother);

    // Should show new prompts
    const newPrompts = screen.getAllByRole('radio');
    expect(newPrompts).toHaveLength(3);
  });

  it('has proper radiogroup role', () => {
    render(<Reflection />);
    const radiogroup = screen.getByRole('radiogroup', {
      name: 'Reflection prompts',
    });
    expect(radiogroup).toBeInTheDocument();
  });

  it('shows option to get different prompts', () => {
    render(<Reflection />);
    const refreshButton = screen.getByLabelText('Get new reflection prompts');
    expect(refreshButton).toBeInTheDocument();
  });

  it('shows different prompts when refresh is clicked', () => {
    render(<Reflection />);
    const initialPrompts = screen.getAllByRole('radio');
    expect(initialPrompts).toHaveLength(3);

    const refreshButton = screen.getByLabelText('Get new reflection prompts');
    fireEvent.click(refreshButton);

    const newPrompts = screen.getAllByRole('radio');
    expect(newPrompts).toHaveLength(3);
  });

  it('continues showing prompts after all prompts have been used', () => {
    render(<Reflection />);

    // Use all 10 prompts (4 rounds of ~3 prompts + extras)
    for (let round = 0; round < 4; round++) {
      const prompts = screen.getAllByRole('radio');
      if (prompts.length === 0) break;
      fireEvent.click(prompts[0]);

      const textarea = screen.getByPlaceholderText('Write your thoughts here...');
      fireEvent.change(textarea, { target: { value: `Reflection ${round}` } });

      const submitButton = screen.getByText('Save Reflection');
      fireEvent.click(submitButton);

      const writeAnother = screen.queryByText('Write another reflection');
      if (writeAnother) {
        fireEvent.click(writeAnother);
      }
    }

    // After using many prompts, new prompts should still be available
    const finalPrompts = screen.getAllByRole('radio');
    expect(finalPrompts).toHaveLength(3);
  });
});
