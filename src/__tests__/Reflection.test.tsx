import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Reflection } from '../components/Reflection';

describe('Reflection', () => {
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

  it('shows confirmation after submitting reflection', () => {
    render(<Reflection />);

    const prompts = screen.getAllByRole('radio');
    fireEvent.click(prompts[0]);

    const textarea = screen.getByPlaceholderText('Write your thoughts here...');
    fireEvent.change(textarea, { target: { value: 'My reflection' } });

    const submitButton = screen.getByText('Save Reflection');
    fireEvent.click(submitButton);

    expect(screen.getByText('Reflection saved.')).toBeInTheDocument();
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
});
