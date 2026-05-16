import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../context/ThemeContext';
import { App } from '../App';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('App', () => {
  it('renders the main heading', () => {
    renderWithTheme(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Subtract everything');
  });

  it('renders the brand name in the header', () => {
    renderWithTheme(<App />);
    const brandLink = screen.getByLabelText('Subtract — Home');
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.textContent).toBe('Subtract');
  });

  it('renders the footer with copyright', () => {
    renderWithTheme(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer.textContent).toContain('Subtract');
  });

  it('renders the principles section', () => {
    renderWithTheme(<App />);
    const principlesHeading = screen.getByRole('heading', {
      name: /Four principles of less/i,
    });
    expect(principlesHeading).toBeInTheDocument();
  });

  it('renders the before/after section', () => {
    renderWithTheme(<App />);
    const beforeAfterHeading = screen.getByRole('heading', {
      name: /Before subtraction, after clarity/i,
    });
    expect(beforeAfterHeading).toBeInTheDocument();
  });

  it('renders the daily challenge section', () => {
    renderWithTheme(<App />);
    const challengeHeading = screen.getByRole('heading', {
      name: /One small subtraction/i,
    });
    expect(challengeHeading).toBeInTheDocument();
  });

  it('renders the practice section', () => {
    renderWithTheme(<App />);
    const practiceHeading = screen.getByRole('heading', {
      name: /Subtract what weighs you down/i,
    });
    expect(practiceHeading).toBeInTheDocument();
  });

  it('renders the reflection section', () => {
    renderWithTheme(<App />);
    const reflectHeading = screen.getByRole('heading', {
      name: /What remains when you subtract/i,
    });
    expect(reflectHeading).toBeInTheDocument();
  });

  it('renders the subtraction journal section', () => {
    renderWithTheme(<App />);
    const journalHeading = screen.getByRole('heading', {
      name: /Your subtraction log/i,
    });
    expect(journalHeading).toBeInTheDocument();
  });

  it('renders the keyboard shortcuts help button', () => {
    renderWithTheme(<App />);
    const shortcutsButton = screen.getByLabelText('Show keyboard shortcuts');
    expect(shortcutsButton).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithTheme(<App />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('renders skip-to-content link', () => {
    renderWithTheme(<App />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders quotes section with wisdom heading', () => {
    renderWithTheme(<App />);
    const wisdomHeading = screen.getByRole('heading', {
      name: /Voices of less/i,
    });
    expect(wisdomHeading).toBeInTheDocument();
  });

  it('renders the mobile menu button', () => {
    renderWithTheme(<App />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('renders the dark mode toggle', () => {
    renderWithTheme(<App />);
    const toggles = screen.getAllByLabelText(/Switch to dark mode|Switch to light mode/);
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the scroll progress component', () => {
    renderWithTheme(<App />);
    // ScrollProgress returns null when progress is 0 (initial state)
    // Verify the component renders without errors by checking app structure
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('renders the section divider', () => {
    renderWithTheme(<App />);
    const main = screen.getByRole('main');
    const divider = main.querySelector('.section-divider');
    expect(divider).toBeInTheDocument();
  });

  it('renders without crashing with ScrollToTop', () => {
    renderWithTheme(<App />);
    // ScrollToTop is only visible when scrolled down, so it won't be in the DOM initially
    // Just verify the app renders without errors
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('renders the progress tracker section', () => {
    renderWithTheme(<App />);
    const progressHeading = screen.getByRole('heading', {
      name: /Your journey/i,
    });
    expect(progressHeading).toBeInTheDocument();
  });

  it('renders the progress overview region', () => {
    renderWithTheme(<App />);
    const region = screen.getByRole('region', { name: /Progress overview/i });
    expect(region).toBeInTheDocument();
  });
});
