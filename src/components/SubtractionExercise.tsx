import { useState, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ClutterItem {
  id: string;
  label: string;
  removed: boolean;
}

const initialItems: ClutterItem[] = [
  { id: 'meetings', label: 'Unnecessary meetings', removed: false },
  { id: 'notifications', label: 'Endless notifications', removed: false },
  { id: 'features', label: 'Unused features', removed: false },
  { id: 'multitasking', label: 'Multitasking', removed: false },
  { id: 'perfectionism', label: 'Perfectionism', removed: false },
  { id: 'busywork', label: 'Productive-seeming busywork', removed: false },
  { id: 'comparisons', label: 'Social comparisons', removed: false },
  { id: 'assumptions', label: 'Unchecked assumptions', removed: false },
];

export function SubtractionExercise() {
  const [items, setItems] = useState<ClutterItem[]>(initialItems);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const removedCount = items.filter((item) => item.removed).length;
  const remainingCount = items.filter((item) => !item.removed).length;

  const handleRemove = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, removed: true } : item,
      ),
    );
  }, []);

  const handleRestore = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, removed: false } : item,
      ),
    );
  }, []);

  const handleReset = useCallback(() => {
    setItems(initialItems.map((item) => ({ ...item, removed: false })));
  }, []);

  const progressPercent =
    initialItems.length > 0
      ? Math.round((removedCount / initialItems.length) * 100)
      : 0;

  return (
    <section
      id="practice"
      ref={ref}
      className="py-20 sm:py-28"
      aria-labelledby="practice-heading"
    >
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
            Practice
          </p>
          <h2
            id="practice-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Subtract what weighs you down
          </h2>
          <p className="max-w-lg mx-auto text-gray-600">
            Click to subtract each item. Watch how lighter things feel when you
            let go.
          </p>
        </div>

        <div
          className={`max-w-2xl mx-auto transition-all duration-700 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Progress bar */}
          <div className="mb-8" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`Subtraction progress: ${removedCount} of ${initialItems.length} items removed`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {removedCount} of {initialItems.length} subtracted
              </span>
              <span className="text-sm text-gray-500">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items to subtract */}
          <div
            className="space-y-3"
            role="list"
            aria-label="Items to subtract"
          >
            {items.map((item) => (
              <div
                key={item.id}
                role="listitem"
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  item.removed
                    ? 'border-gray-100 bg-gray-50 opacity-50'
                    : 'border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm'
                }`}
              >
                <span
                  className={`text-base transition-all duration-300 ${
                    item.removed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                  }`}
                >
                  {item.label}
                </span>
                <button
                  onClick={() =>
                    item.removed
                      ? handleRestore(item.id)
                      : handleRemove(item.id)
                  }
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    item.removed
                      ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                      : 'text-brand-500 hover:bg-brand-50'
                  }`}
                  aria-label={
                    item.removed
                      ? `Restore ${item.label}`
                      : `Subtract ${item.label}`
                  }
                >
                  {item.removed ? '+' : '−'}
                </button>
              </div>
            ))}
          </div>

          {/* Result message */}
          {remainingCount === 0 && (
            <div
              className="mt-8 p-6 bg-brand-50 rounded-2xl text-center"
              role="status"
              aria-live="polite"
            >
              <p className="text-brand-700 font-medium text-lg mb-2">
                You&apos;ve subtracted everything.
              </p>
              <p className="text-brand-600 text-sm">
                Notice how the absence creates clarity. That&apos;s the power of
                less.
              </p>
            </div>
          )}

          {/* Reset button */}
          {removedCount > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded"
              >
                Reset exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
