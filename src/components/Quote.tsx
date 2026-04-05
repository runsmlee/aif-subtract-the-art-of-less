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
];

export function Quote() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 bg-gray-50/50"
      aria-label="Inspiring quotes about simplicity"
    >
      <div className="section-container">
        <div className="max-w-3xl mx-auto space-y-16">
          {quotes.map((quote, index) => (
            <blockquote
              key={quote.author}
              className={`text-center transition-all duration-700 ${
                shouldAnimate
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: prefersReducedMotion ? '0ms' : `${index * 200}ms`,
              }}
            >
              <p className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed mb-4 italic">
                &ldquo;{quote.text}&rdquo;
              </p>
              <cite className="text-sm font-medium text-gray-500 not-italic">
                — {quote.author}
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
