import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getLocalDateStr } from '../utils/date';

interface ProgressStat {
  label: string;
  value: number;
  max: number;
  icon: string;
  storageKey: string;
  isComplete?: boolean;
}

function readCountFromStorage(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length;
    if (typeof parsed === 'object' && parsed !== null && 'completedIds' in parsed) {
      const obj = parsed as { completedIds: unknown[] };
      return Array.isArray(obj.completedIds) ? obj.completedIds.length : 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

function isChallengeCompletedToday(): boolean {
  try {
    const raw = localStorage.getItem('subtract-challenges');
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return false;
    const obj = parsed as Record<string, unknown>;
    const today = getLocalDateStr();
    return obj.date === today && Array.isArray(obj.completedIds) && obj.completedIds.length > 0;
  } catch {
    return false;
  }
}

export function ProgressTracker() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const exerciseRemoved = readCountFromStorage('subtract-exercise');
  const beforeAfterRevealed = readCountFromStorage('subtract-beforeafter');
  const journalEntries = readCountFromStorage('subtract-journal');
  const reflectionsCount = readCountFromStorage('subtract-reflections');
  const mindfulSessions = readCountFromStorage('subtract-mindful-sessions');
  const challengeCompleted = isChallengeCompletedToday();

  const stats: ProgressStat[] = [
    {
      label: 'Items subtracted',
      value: exerciseRemoved,
      max: 8,
      icon: '−',
      storageKey: 'subtract-exercise',
      isComplete: exerciseRemoved >= 8,
    },
    {
      label: 'Before & After',
      value: beforeAfterRevealed,
      max: 4,
      icon: '◎',
      storageKey: 'subtract-beforeafter',
      isComplete: beforeAfterRevealed >= 4,
    },
    {
      label: 'Journal entries',
      value: journalEntries,
      max: 0, // No max for journal
      icon: '◻',
      storageKey: 'subtract-journal',
    },
    {
      label: 'Reflections',
      value: reflectionsCount,
      max: 0, // No max for reflections
      icon: '◉',
      storageKey: 'subtract-reflections',
    },
    {
      label: 'Mindful breaks',
      value: mindfulSessions,
      max: 0,
      icon: '○',
      storageKey: 'subtract-mindful-sessions',
    },
  ];

  const totalActive = stats.filter((s) => s.value > 0).length;

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20"
      aria-label="Progress overview"
    >
      <div className="section-container">
        <div
          className={`max-w-3xl mx-auto transition-all duration-700 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-center mb-10">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
              Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Your journey
            </h2>
          </div>

          {/* Progress grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.storageKey}
                className={`group p-5 rounded-2xl border text-center transition-all duration-300 ${
                  stat.isComplete
                    ? 'border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/30'
                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div
                  className={`w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-xl text-lg transition-colors duration-200 ${
                    stat.value > 0
                      ? 'bg-brand-50 dark:bg-brand-950 text-brand-500'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  }`}
                  aria-hidden="true"
                >
                  {stat.icon}
                </div>
                <p
                  className={`text-2xl font-bold ${
                    stat.value > 0
                      ? 'text-brand-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </p>
                {stat.isComplete && (
                  <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400">
                    Complete
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Today's challenge status */}
          <div className="mt-6 text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                challengeCompleted
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400'
              }`}
            >
              <span aria-hidden="true">{challengeCompleted ? '✓' : '○'}</span>
              <span>Today&apos;s challenge {challengeCompleted ? 'completed' : 'awaiting'}</span>
            </div>
          </div>

          {/* Summary */}
          {totalActive > 0 && (
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {totalActive === stats.length
                ? 'You\'re engaging with every section. Keep subtracting.'
                : `${totalActive} of ${stats.length} areas started. Every subtraction counts.`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
