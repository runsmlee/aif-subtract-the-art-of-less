import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

const quotes = [
  {
    text: 'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.',
    author: 'Antoine de Saint-Exupéry',
  },
  {
    text: 'The ability to simplify means to eliminate the unnecessary so that the necessary may speak.',
    author: 'Hans Hofmann',
  },
  {
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
  },
  {
    text: 'Less is more.',
    author: 'Ludwig Mies van der Rohe',
  },
  {
    text: 'It is not a daily increase, but a daily decrease. Hack away the unessential.',
    author: 'Bruce Lee',
  },
];

export function Quote() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;
  const touchStartRef = useRef<number>(0);

  // Auto-advance every 6 seconds (paused when hovered)
  useEffect(() => {
    if (!isInView || isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, isPaused, currentIndex]);

  const goToQuote = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, prefersReducedMotion ? 0 : 200);
  }, [isTransitioning, prefersReducedMotion]);

  const goToNext = useCallback(() => {
    goToQuote((currentIndex + 1) % quotes.length);
  }, [currentIndex, goToQuote]);

  const goToPrev = useCallback(() => {
    goToQuote((currentIndex - 1 + quotes.length) % quotes.length);
  }, [currentIndex, goToQuote]);

  const currentQuote = quotes[currentIndex];

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }, [goToNext, goToPrev]);

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 bg-white dark:bg-gray-950"
      aria-label="Inspiring quotes about simplicity"
    >
      <div className="section-container">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
            Wisdom
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Voices of less
          </h2>
        </div>

        <div
          className={`max-w-3xl mx-auto transition-all duration-700 delay-100 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Quote display */}
          <div
            className="relative min-h-[200px] sm:min-h-[180px] flex items-center justify-center cursor-grab active:cursor-grabbing"
            role="region"
            aria-roledescription="carousel"
            aria-label="Quote carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <blockquote
              key={currentIndex}
              className={`text-center absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 px-4 ${
                isTransitioning
                  ? 'opacity-0 translate-y-2'
                  : 'opacity-100 translate-y-0'
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                className="w-8 h-px bg-brand-300 dark:bg-brand-700 mb-6"
                aria-hidden="true"
              />
              <p className="text-lg sm:text-2xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-4 italic">
                &ldquo;{currentQuote.text}&rdquo;
              </p>
              <cite className="text-sm font-medium text-gray-500 dark:text-gray-400 not-italic">
                — {currentQuote.author}
              </cite>
            </blockquote>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={goToPrev}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Previous quote"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Quote navigation">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    index === currentIndex
                      ? 'bg-brand-500 w-6'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Quote ${index + 1} by ${quotes[index].author}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Next quote"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Pause indicator */}
          {isPaused && (
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3" aria-live="polite">
              Paused — move cursor away to resume
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
