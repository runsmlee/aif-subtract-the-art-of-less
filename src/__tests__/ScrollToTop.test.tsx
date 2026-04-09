import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScrollToTop } from '../components/ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  it('does not render when at top of page', () => {
    render(<ScrollToTop />);
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });

  it('renders when scrolled down', () => {
    render(<ScrollToTop />);

    // Simulate scrolling down
    Object.defineProperty(window, 'scrollY', { value: 500 });
    fireEvent.scroll(window);

    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('scrolls to top when clicked', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<ScrollToTop />);

    // Simulate scrolling down
    Object.defineProperty(window, 'scrollY', { value: 500 });
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Scroll to top');
    fireEvent.click(button);

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0 }),
    );

    scrollToSpy.mockRestore();
  });

  it('is accessible with proper aria-label', () => {
    render(<ScrollToTop />);

    Object.defineProperty(window, 'scrollY', { value: 500 });
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Scroll to top');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });
});
