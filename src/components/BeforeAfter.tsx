import { useState, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ComparisonItem {
  id: string;
  before: string;
  after: string;
  icon: string;
  beforeCount: number;
  afterCount: number;
}

const comparisons: ComparisonItem[] = [
  { id: 'design', before: '10 decorative elements', after: '1 clear message', icon: '✦', beforeCount: 10, afterCount: 1 },
  { id: 'schedule', before: '12 meetings this week', after: '3 meaningful conversations', icon: '◎', beforeCount: 12, afterCount: 3 },
  { id: 'goals', before: '25 priorities for Q4', after: '3 outcomes that matter', icon: '◆', beforeCount: 25, afterCount: 3 },
  { id: 'inbox', before: '200 unread emails', after: '5 requiring action', icon: '○', beforeCount: 200, afterCount: 5 },
];

function ComparisonCard({
  item,
  isRevealed,
  isAnimating,
  onReveal,
}: {
  item: ComparisonItem;
  isRevealed: boolean;
  isAnimating: boolean;
  onReveal: () => void;
}) {
  const reductionPercent = Math.round(((item.beforeCount - item.afterCount) / item.beforeCount) * 100);

  return (
    <button
      onClick={onReveal}
      className={`group w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
        isAnimating
          ? 'scale-[0.98]'
          : ''
      } ${
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
          {isRevealed && (
            <div className="mt-2 flex items-center gap-2">
              <div
                className="h-1 rounded-full bg-brand-200 dark:bg-brand-800 flex-1 overflow-hidden"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-1000"
                  style={{ width: `${reductionPercent}%` }}
                />
              </div>
              <span className="text-xs text-brand-500 font-medium">{reductionPercent}% less</span>
            </div>
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
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const allRevealed = revealedIds.size === comparisons.length;
  const revealedCount = revealedIds.size;

  const handleReveal = useCallback((id: string) => {
    setAnimatingId(id);
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => setAnimatingId(null), 500);
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
            {/* Progress indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {comparisons.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < revealedCount
                        ? 'bg-brand-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                {revealedCount}/{comparisons.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {comparisons.map((item) => (
              <ComparisonCard
                key={item.id}
                item={item}
                isRevealed={revealedIds.has(item.id)}
                isAnimating={animatingId === item.id}
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
            <div
              className="mt-8 p-6 sm:p-8 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950 dark:to-gray-900 rounded-2xl border border-brand-100 dark:border-brand-800 text-center"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">
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
