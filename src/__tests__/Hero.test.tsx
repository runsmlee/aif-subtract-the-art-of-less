import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Hero } from '../components/Hero';
import { HERO_INPUT_KEY } from '../components/Hero';

function renderHero() {
  return render(<Hero />);
}

describe('Hero', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the main heading', () => {
    renderHero();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Subtract everything');
  });

  it('renders the interactive subtraction input', () => {
    renderHero();
    const input = screen.getByPlaceholderText('What would you subtract?');
    expect(input).toBeInTheDocument();
  });

  it('renders the input with accessible label', () => {
    renderHero();
    const input = screen.getByLabelText('What would you subtract?');
    expect(input).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    renderHero();
    const submitButton = screen.getByLabelText('Subtract this item');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when input has text', () => {
    renderHero();
    const input = screen.getByPlaceholderText('What would you subtract?');
    fireEvent.change(input, { target: { value: 'Unnecessary meetings' } });
    const submitButton = screen.getByLabelText('Subtract this item');
    expect(submitButton).not.toBeDisabled();
  });

  it('stores submitted item in localStorage and shows confirmation', () => {
    renderHero();
    const input = screen.getByPlaceholderText('What would you subtract?');
    fireEvent.change(input, { target: { value: 'My bad habit' } });
    fireEvent.submit(input.closest('form')!);

    // Should show confirmation
    expect(screen.getByText('Subtracted. Keep going below.')).toBeInTheDocument();

    // Should store in localStorage
    const stored = JSON.parse(localStorage.getItem(HERO_INPUT_KEY) || '[]');
    expect(stored).toContain('My bad habit');
  });

  it('replaces input with confirmation after submission', () => {
    renderHero();
    const input = screen.getByPlaceholderText('What would you subtract?');
    fireEvent.change(input, { target: { value: 'Test item' } });
    fireEvent.submit(input.closest('form')!);

    // Input should be replaced by confirmation message
    expect(screen.queryByPlaceholderText('What would you subtract?')).not.toBeInTheDocument();
    expect(screen.getByText('Subtracted. Keep going below.')).toBeInTheDocument();
  });

  it('does not submit empty input', () => {
    renderHero();
    const input = screen.getByPlaceholderText('What would you subtract?');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    // Should NOT show confirmation
    expect(screen.queryByText('Subtracted. Keep going below.')).not.toBeInTheDocument();
    // Should NOT store in localStorage
    expect(localStorage.getItem(HERO_INPUT_KEY)).toBeNull();
  });

  it('renders the CTA buttons', () => {
    renderHero();
    expect(screen.getByText('Try the Exercise')).toBeInTheDocument();
    expect(screen.getByText('Learn Why')).toBeInTheDocument();
  });

  it('renders the "The Art of Less" subtitle', () => {
    renderHero();
    expect(screen.getByText('The Art of Less')).toBeInTheDocument();
  });

  it('renders key statistics', () => {
    renderHero();
    const statsGroup = screen.getByRole('group', { name: 'Key statistics' });
    expect(statsGroup).toBeInTheDocument();
  });
});
