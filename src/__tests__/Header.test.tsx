import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../context/ThemeContext';
import { Header } from '../components/Header';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Header', () => {
  it('renders the brand link', () => {
    renderWithTheme(<Header />);
    const brandLink = screen.getByLabelText('Subtract — Home');
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.textContent).toBe('Subtract');
  });

  it('renders desktop navigation links', () => {
    renderWithTheme(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('renders the CTA button', () => {
    renderWithTheme(<Header />);
    const ctaButtons = screen.getAllByText('Start Subtracting');
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the mobile menu button', () => {
    renderWithTheme(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    renderWithTheme(<Header />);
    const menuButton = screen.getByLabelText('Open menu');

    // Menu should be closed initially
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(menuButton);

    // Button label should change
    const closeButton = screen.getByLabelText('Close menu');
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes mobile menu on Escape key', () => {
    renderWithTheme(<Header />);
    const menuButton = screen.getByLabelText('Open menu');

    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Close menu')).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Menu should be closed
    expect(screen.getByLabelText('Open menu')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('has proper banner role', () => {
    renderWithTheme(<Header />);
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
  });

  it('renders the theme toggle button', () => {
    renderWithTheme(<Header />);
    const toggles = screen.getAllByLabelText(/Switch to dark mode|Switch to light mode/);
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });

  it('toggles theme on button click', () => {
    renderWithTheme(<Header />);
    const toggles = screen.getAllByLabelText(/Switch to dark mode/);
    expect(toggles.length).toBeGreaterThanOrEqual(1);

    // Click the first toggle (desktop)
    fireEvent.click(toggles[0]);

    // Should now show switch to light mode
    const newToggles = screen.getAllByLabelText(/Switch to light mode/);
    expect(newToggles.length).toBeGreaterThanOrEqual(1);
  });
});
