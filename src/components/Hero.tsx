import { useState, useCallback, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

const HERO_INPUT_KEY = 'subtract-hero-input';

export { HERO_INPUT_KEY };

export function Hero() {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed.length === 0) return;

    // Store the URL for the SubtractionExercise to pick up
    const stored: string[] = JSON.parse(localStorage.getItem(HERO_INPUT_KEY) || '[]');
    stored.push(trimmed);
    localStorage.setItem(HERO_INPUT_KEY, JSON.stringify(stored));

    setSubmitted(true);
    setInputValue('');

    // Track the interaction
    if (typeof window !== 'undefined' && window.aif?.track) {
      window.aif.track('hero_subtract', { item: trimmed });
    }

    // Scroll to the exercise section
    setTimeout(() => {
      document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [inputValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero"
    >
      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Gradient accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="section-container text-center py-20 sm:py-28 relative z-10 max-w-2xl mx-auto">
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1] mb-6 transition-all duration-700 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          Cognitive Load Index
          <br />
          <span className="text-brand-500">See What to Subtract.</span>
        </h1>

        <p
          className={`text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-10 transition-all duration-700 delay-100 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          Paste a URL. See its cognitive load. Know what to subtract.
        </p>

        {/* Interactive URL input — primary user action */}
        <div
          className={`max-w-lg mx-auto transition-all duration-700 delay-200 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="relative" aria-label="Analyze a URL">
              <label htmlFor="hero-url-input" className="sr-only">
                Paste a URL to analyze cognitive load
              </label>
              <input
                ref={inputRef}
                id="hero-url-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste any URL to analyze..."
                className="w-full h-14 px-5 pr-14 text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 shadow-sm"
                maxLength={500}
                aria-describedby="hero-url-hint"
              />
              <button
                type="submit"
                disabled={inputValue.trim().length === 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-lg text-white bg-brand-500 hover:bg-brand-600 dark:hover:bg-brand-400 active:bg-brand-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                aria-label="Analyze this URL"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <p id="hero-url-hint" className="sr-only">
                Enter a webpage URL to measure its cognitive load
              </p>
            </form>
          ) : (
            <div
              className="h-14 flex items-center justify-center gap-2 text-brand-600 dark:text-brand-400 font-medium animate-fade-in"
              role="status"
              aria-live="polite"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              URL added. Scroll down to start subtracting.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
