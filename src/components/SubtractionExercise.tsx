import { useState, useCallback, useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ClutterItem {
  id: string;
  label: string;
  removed: boolean;
  isCustom?: boolean;
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

function CompletionCelebration({ onReset, onReflect, onShare }: { onReset: () => void; onReflect: () => void; onShare: () => void }) {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const shouldAnimate = isInView;

  return (
    <div
      ref={ref}
      className={`mt-8 transition-all duration-700 ${
        shouldAnimate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="p-8 sm:p-10 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950 dark:to-gray-900 border border-brand-100 dark:border-brand-800 rounded-2xl text-center">
        {/* Celebration visual */}
        <div className="mb-6" aria-hidden="true">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-brand-100 dark:bg-brand-900/50 animate-ping opacity-20" />
            <div className="absolute inset-2 rounded-full bg-brand-200 dark:bg-brand-900/80 animate-pulse" />
            <div className="absolute inset-4 rounded-full bg-brand-500 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        <p className="text-brand-700 dark:text-brand-300 font-semibold text-xl mb-2">
          You&apos;ve subtracted everything.
        </p>
        <p className="text-brand-600 dark:text-brand-400 leading-relaxed max-w-md mx-auto mb-8">
          Notice how the absence creates clarity. The space you&apos;ve
          opened is where meaning begins. That&apos;s the power of less.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-500">8</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Items removed</p>
          </div>
          <div className="w-px bg-brand-200 dark:bg-brand-800" />
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-500">100%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Clarity gained</p>
          </div>
          <div className="w-px bg-brand-200 dark:bg-brand-800" />
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-500">∞</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Potential unlocked</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReflect}
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Reflect on What Remains
          </button>
          <button
            onClick={onShare}
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-800 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mr-2" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share Score
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

function RemovedToast({ label }: { label: string }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up pointer-events-none"
      role="status"
      aria-live="polite"
    >
      − Subtracted: {label}
    </div>
  );
}

export function SubtractionExercise() {
  const [items, setItems] = useState<ClutterItem[]>(initialItems);
  const [customInput, setCustomInput] = useState('');
  const customIdCounter = useRef(0);
  const [toast, setToast] = useState<string | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const removedCount = items.filter((item) => item.removed).length;
  const remainingCount = items.filter((item) => !item.removed).length;
  const totalCount = items.length;

  const showToast = useCallback((label: string) => {
    setToast(label);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const handleRemove = useCallback((id: string, label: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, removed: true } : item,
      ),
    );
    showToast(label);
  }, [showToast]);

  const handleRestore = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, removed: false } : item,
      ),
    );
  }, []);

  const handleReset = useCallback(() => {
    setItems(initialItems.map((item) => ({ ...item, removed: false })));
    setCustomInput('');
  }, []);

  const handleDeleteCustom = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAddCustom = useCallback(() => {
    const trimmed = customInput.trim();
    if (trimmed.length === 0) return;

    customIdCounter.current += 1;
    const newItem: ClutterItem = {
      id: `custom-${customIdCounter.current}`,
      label: trimmed,
      removed: false,
      isCustom: true,
    };
    setItems((prev) => [...prev, newItem]);
    setCustomInput('');
  }, [customInput]);

  const handleCustomKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddCustom();
      }
    },
    [handleAddCustom],
  );

  const progressPercent =
    totalCount > 0 ? Math.round((removedCount / totalCount) * 100) : 0;

  const isComplete = remainingCount === 0 && totalCount > 0;

  // Build a shareable summary
  const getShareText = useCallback(() => {
    const removed = items.filter((item) => item.removed);
    const labels = removed.map((item) => item.label).join(', ');
    return `I subtracted ${removedCount} things that don't matter: ${labels}. Try it yourself at Subtract — The Art of Less.`;
  }, [items, removedCount]);

  const handleShare = useCallback(async () => {
    const text = getShareText();
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: 'My Subtraction Score', text });
          return;
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          // Share failed (not cancelled) — fall through to clipboard
        }
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast('Score copied to clipboard');
      }
    } catch {
      showToast('Could not share — try copying manually');
    }
  }, [getShareText, showToast]);

  // Keyboard shortcut: number keys to remove items
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        const remainingItems = items.filter((item) => !item.removed);
        if (num <= remainingItems.length) {
          const targetItem = remainingItems[num - 1];
          handleRemove(targetItem.id, targetItem.label);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, handleRemove]);

  return (
    <section
      id="practice"
      ref={ref}
      className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/50"
      aria-labelledby="practice-heading"
    >
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
            Practice
          </p>
          <h2
            id="practice-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          >
            Subtract what weighs you down
          </h2>
          <p className="max-w-lg mx-auto text-gray-600 dark:text-gray-400">
            Click to subtract each item. Watch how lighter things feel when you
            let go.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Tip: Press 1-9 to subtract by keyboard
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
          <div
            className="mb-8"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Subtraction progress: ${removedCount} of ${totalCount} items removed`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {removedCount} of {totalCount} subtracted
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{progressPercent}%</span>
            </div>
            <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Milestone markers at 25%, 50%, 75% */}
              {[25, 50, 75].map((milestone) => (
                <div
                  key={milestone}
                  className="absolute top-0 h-full w-px bg-gray-300 dark:bg-gray-600"
                  style={{ left: `${milestone}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
            {/* Milestone labels */}
            <div className="relative mt-1.5 h-4">
              {[25, 50, 75].map((milestone) => (
                <span
                  key={milestone}
                  className={`absolute text-[10px] font-medium transition-colors duration-300 -translate-x-1/2 ${
                    progressPercent >= milestone
                      ? 'text-brand-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  style={{ left: `${milestone}%` }}
                  aria-hidden="true"
                >
                  {milestone}%
                </span>
              ))}
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
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  item.removed
                    ? 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm dark:hover:shadow-none'
                }`}
              >
                <span
                  className={`text-base transition-all duration-300 ${
                    item.removed
                      ? 'line-through text-gray-400 dark:text-gray-600'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {item.label}
                </span>
                <div className="flex items-center gap-1">
                  {item.isCustom && !item.removed && (
                    <button
                      onClick={() => handleDeleteCustom(item.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900"
                      aria-label={`Delete ${item.label}`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4M11 4v7.5a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 013 11.5V4" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() =>
                      item.removed
                        ? handleRestore(item.id)
                        : handleRemove(item.id, item.label)
                    }
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                      item.removed
                        ? 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950'
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
              </div>
            ))}
          </div>

          {/* Add custom item */}
          <div className="mt-4 flex gap-2">
            <label htmlFor="custom-item-input" className="sr-only">
              Add your own item to subtract
            </label>
            <input
              id="custom-item-input"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleCustomKeyDown}
              placeholder="Add your own item to subtract..."
              className="flex-1 h-12 px-4 text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              maxLength={100}
            />
            <button
              onClick={handleAddCustom}
              disabled={customInput.trim().length === 0}
              className="inline-flex items-center justify-center h-12 px-5 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 dark:hover:bg-brand-400 active:bg-brand-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Add custom item"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="9" y1="3" x2="9" y2="15" />
                <line x1="3" y1="9" x2="15" y2="9" />
              </svg>
            </button>
          </div>

          {/* Completion celebration */}
          {isComplete && (
            <CompletionCelebration
              onReset={handleReset}
              onReflect={() => {
                document.getElementById('reflect')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onShare={handleShare}
            />
          )}

          {/* Reset button */}
          {removedCount > 0 && !isComplete && (
            <div className="mt-6 text-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded"
              >
                Reset exercise
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && <RemovedToast label={toast} />}
    </section>
  );
}
