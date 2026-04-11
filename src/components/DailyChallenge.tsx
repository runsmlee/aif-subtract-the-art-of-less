import { useState, useEffect, useCallback } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  action: string;
  category: 'mind' | 'time' | 'stuff' | 'digital';
}

const challenges: Challenge[] = [
  {
    id: 'unsubscribe',
    title: 'The Unsubscribe Challenge',
    description: 'Open your email and unsubscribe from 5 newsletters you haven\'t read in the last month.',
    action: 'I unsubscribed from 5',
    category: 'digital',
  },
  {
    id: 'one-thing',
    title: 'The One Thing',
    description: 'Look at your to-do list. Pick the single most important task and do only that today.',
    action: 'I focused on one thing',
    category: 'time',
  },
  {
    id: 'closet',
    title: 'The Reverse Hanger',
    description: 'Turn all your hangers backward. After 30 days, donate whatever is still hanging backward.',
    action: 'I started the hanger test',
    category: 'stuff',
  },
  {
    id: 'notification',
    title: 'The Notification Cleanse',
    description: 'Turn off all non-essential notifications for 24 hours. Notice what you actually miss.',
    action: 'I silenced notifications',
    category: 'digital',
  },
  {
    id: 'no-meeting',
    title: 'The Meeting Fast',
    description: 'Block 2 hours of uninterrupted time today. No calls, no meetings — just deep work.',
    action: 'I carved out deep time',
    category: 'time',
  },
  {
    id: 'single-task',
    title: 'The Single-Task Hour',
    description: 'Close every tab except one. Work on just that for 60 minutes. No switching allowed.',
    action: 'I single-tasked for an hour',
    category: 'mind',
  },
  {
    id: 'gratitude',
    title: 'The Gratitude Subtraction',
    description: 'Instead of adding to your gratitude list, name 3 things you\'re glad you no longer have in your life.',
    action: 'I reflected on what I\'ve lost',
    category: 'mind',
  },
  {
    id: 'app-delete',
    title: 'The App Purge',
    description: 'Delete 3 apps from your phone that you haven\'t opened this week. Don\'t reinstall them for a month.',
    action: 'I deleted 3 apps',
    category: 'digital',
  },
  {
    id: 'five-minute',
    title: 'The Five-Minute Rule',
    description: 'If something takes less than 5 minutes to complete, either do it now or remove it from your list entirely.',
    action: 'I applied the 5-minute rule',
    category: 'time',
  },
  {
    id: 'surface',
    title: 'The Clear Surface',
    description: 'Clear one surface completely — your desk, a counter, your nightstand. Enjoy the empty space.',
    action: 'I cleared a surface',
    category: 'stuff',
  },
];

function getDailyChallengeIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return dayOfYear % challenges.length;
}

function getCategoryIcon(category: Challenge['category']): string {
  switch (category) {
    case 'mind':
      return '◉';
    case 'time':
      return '◷';
    case 'stuff':
      return '◻';
    case 'digital':
      return '⊡';
  }
}

function getCategoryLabel(category: Challenge['category']): string {
  switch (category) {
    case 'mind':
      return 'Mindset';
    case 'time':
      return 'Time';
    case 'stuff':
      return 'Possessions';
    case 'digital':
      return 'Digital';
  }
}

export function DailyChallenge() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const challengeIndex = getDailyChallengeIndex();
  const challenge = challenges[challengeIndex];

  useEffect(() => {
    const stored = localStorage.getItem(`subtract-challenge-${challenge.id}`);
    if (stored === 'completed') {
      setIsCompleted(true);
    }
  }, [challenge.id]);

  useEffect(() => {
    const ids = new Set<string>();
    for (const c of challenges) {
      const stored = localStorage.getItem(`subtract-challenge-${c.id}`);
      if (stored === 'completed') {
        ids.add(c.id);
      }
    }
    setCompletedIds(ids);
  }, [isCompleted]);

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    setShowConfetti(true);
    localStorage.setItem(`subtract-challenge-${challenge.id}`, 'completed');
    setTimeout(() => setShowConfetti(false), 2000);
  }, [challenge.id]);

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28 relative overflow-hidden"
      aria-labelledby="challenge-heading"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="section-container">
        <div
          className={`max-w-2xl mx-auto transition-all duration-700 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
              Today&apos;s Challenge
            </p>
            <h2
              id="challenge-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              One small subtraction
            </h2>
            <p className="max-w-lg mx-auto text-gray-600 dark:text-gray-400">
              A different challenge every day. Small acts of less that add up to
              something meaningful.
            </p>
          </div>

          <div className="relative">
            {/* Challenge card */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 ${
                isCompleted
                  ? 'border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/30'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-brand-500/5'
              }`}
            >
              {/* Confetti effect */}
              {showConfetti && !prefersReducedMotion && (
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-brand-500"
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animation: `fadeIn 0.3s ease-out ${i * 50}ms both, scaleIn 0.4s ease-out ${i * 50}ms both`,
                        opacity: 0.6 + Math.random() * 0.4,
                        transform: `scale(${0.5 + Math.random()})`,
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-xl transition-all duration-300 ${
                    isCompleted
                      ? 'bg-brand-100 dark:bg-brand-900 text-brand-500'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  }`}
                  aria-hidden="true"
                >
                  {getCategoryIcon(challenge.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {getCategoryLabel(challenge.category)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {challenge.description}
                  </p>

                  {!isCompleted && (
                    <button
                      onClick={handleComplete}
                      className="mt-5 inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 active:bg-brand-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="mr-2"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {challenge.action}
                    </button>
                  )}

                  {isCompleted && (
                    <div className="mt-5 flex items-center gap-2 text-brand-600 dark:text-brand-400">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span className="text-sm font-medium">
                        Challenge completed today
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5" role="group" aria-label="Challenge progress">
                {challenges.slice(0, 7).map((c, i) => {
                  const dayOffset = i;
                  const isToday = dayOffset === 0;
                  const done = completedIds.has(c.id);

                  return (
                    <div
                      key={c.id}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isToday
                          ? 'bg-brand-500 w-4'
                          : done
                            ? 'bg-brand-300 dark:bg-brand-700'
                            : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      title={c.title}
                      aria-label={`${c.title}${done ? ' (completed)' : ''}${isToday ? ' (today)' : ''}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
