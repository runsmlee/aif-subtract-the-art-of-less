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
    expect(heading.textContent).toContain('Website Clutter Score');
  });

  it('renders the URL input', () => {
    renderHero();
    const input = screen.getByPlaceholderText('Paste any URL to analyze...');
    expect(input).toBeInTheDocument();
  });

  it('renders the input with accessible label', () => {
    renderHero();
    const input = screen.getByLabelText('Paste a URL to check its clutter score');
    expect(input).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    renderHero();
    const submitButton = screen.getByLabelText('Analyze this URL');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when input has text', () => {
    renderHero();
    const input = screen.getByPlaceholderText('Paste any URL to analyze...');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    const submitButton = screen.getByLabelText('Analyze this URL');
    expect(submitButton).not.toBeDisabled();
  });

  it('stores submitted URL in localStorage and shows confirmation', () => {
    renderHero();
    const input = screen.getByPlaceholderText('Paste any URL to analyze...');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.submit(input.closest('form')!);

    // Should show confirmation
    expect(screen.getByText(/URL added/)).toBeInTheDocument();

    // Should store in localStorage
    const stored = JSON.parse(localStorage.getItem(HERO_INPUT_KEY) || '[]');
    expect(stored).toContain('https://example.com');
  });

  it('replaces input with confirmation after submission', () => {
    renderHero();
    const input = screen.getByPlaceholderText('Paste any URL to analyze...');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.submit(input.closest('form')!);

    // Input should be replaced by confirmation message
    expect(screen.queryByPlaceholderText('Paste any URL to analyze...')).not.toBeInTheDocument();
    expect(screen.getByText(/URL added/)).toBeInTheDocument();
  });

  it('does not submit empty input', () => {
    renderHero();
    const input = screen.getByPlaceholderText('Paste any URL to analyze...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    // Should NOT show confirmation
    expect(screen.queryByText(/URL added/)).not.toBeInTheDocument();
    // Should NOT store in localStorage
    expect(localStorage.getItem(HERO_INPUT_KEY)).toBeNull();
  });

  it('renders the micro-copy tagline', () => {
    renderHero();
    expect(screen.getByText(/clutter score.*what to delete/i)).toBeInTheDocument();
  });

  it('renders the before/after micro-demo with score delta', () => {
    renderHero();
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
    expect(screen.getByText('73')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
    expect(screen.getByText(/−42 pts/)).toBeInTheDocument();
  });
});
