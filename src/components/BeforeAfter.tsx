import { useState, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ComparisonItem {
  id: string;
  before: string;
  after: string;
  icon: string;
}

const comparisons: ComparisonItem[] = [
  { id: 'design', before: '10 decorative elements', after: '1 clear message', icon: '✦' },
  { id: 'schedule', before: '12 meetings this week', after: '3 meaningful conversations', icon: '◎' },
  { id: 'goals', before: '25 priorities for Q4', after: '3 outcomes that matter', icon: '◆' },
  { id: 'inbox', before: '200 unread emails', after: '5 requiring action', icon: '○' },
];

function ComparisonCard({
  item,
  isRevealed,
  onReveal,
}: {
  item: ComparisonItem;
  isRevealed: boolean;
  onReveal: () => void;
}) {
  return (
    <button
      onClick={onReveal}
      className={`group w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
        isRevealed
          ? 'border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/30'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm cursor-pointer'
      }`}
      aria-label={isRevealed ? `${item.after} — revealed` : `Reveal: ${item.before}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-lg transition-all duration-300 ${
            isRevealed
              ? 'bg-brand-100 dark:bg-brand-900 text-brand-500'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:text-brand-400'
          }`}
          aria-hidden="true"
        >
          {item.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className={`transition-all duration-500 ${isRevealed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">Before</p>
            <p className="text-base font-medium text-gray-800 dark:text-gray-200">{item.before}</p>
          </div>
          <div className={`transition-all duration-500 ${isRevealed ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
            <p className="text-sm text-brand-500 font-medium mb-0.5">After</p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.after}</p>
          </div>
          {!isRevealed && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 group-hover:text-brand-400 transition-colors duration-200">
              Click to subtract →
            </p>
          )}
        </div>
        {isRevealed && (
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-brand-500 text-white text-xs" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
    </button>
  );
}

export function BeforeAfter() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const allRevealed = revealedIds.size === comparisons.length;

  const handleReveal = useCallback((id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleRevealAll = useCallback(() => {
    setRevealedIds(new Set(comparisons.map((c) => c.id)));
  }, []);

  return (
    <section
      className="py-20 sm:py-28"
      aria-labelledby="beforeafter-heading"
    >
      <div className="section-container">
        <div
          ref={ref}
          className={`max-w-2xl mx-auto transition-all duration-700 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
              See the difference
            </p>
            <h2
              id="beforeafter-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              Before subtraction, after clarity
            </h2>
            <p className="max-w-lg mx-auto text-gray-600 dark:text-gray-400">
              Click each card to see what happens when you apply the art of less.
            </p>
          </div>

          <div className="space-y-4">
            {comparisons.map((item) => (
              <ComparisonCard
                key={item.id}
                item={item}
                isRevealed={revealedIds.has(item.id)}
                onReveal={() => handleReveal(item.id)}
              />
            ))}
          </div>

          {!allRevealed && (
            <div className="mt-6 text-center">
              <button
                onClick={handleRevealAll}
                className="text-sm text-gray-400 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950 rounded underline underline-offset-4"
              >
                Reveal all at once
              </button>
            </div>
          )}

          {allRevealed && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Every subtraction reveals something more valuable.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This is the power of less in action.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
