import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface JournalEntry {
  id: string;
  text: string;
  date: string;
  createdAt: number;
}

const STORAGE_KEY = 'subtract-journal';

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e: unknown): e is JournalEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as Record<string, unknown>).id === 'string' &&
        typeof (e as Record<string, unknown>).text === 'string' &&
        typeof (e as Record<string, unknown>).date === 'string' &&
        typeof (e as Record<string, unknown>).createdAt === 'number',
    );
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getStreakCount(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const dates = new Set(
    entries.map((e) => e.date),
  );
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dates.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export function SubtractionJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => loadEntries());
  const [newEntry, setNewEntry] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const streak = useMemo(() => getStreakCount(entries), [entries]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = entries.filter((e) => e.date === todayStr).length;
  const totalCount = entries.length;

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
    if (filter === 'today') return sorted.filter((e) => e.date === todayStr);
    if (filter === 'week') {
      const weekAgo = Date.now() - 7 * 86400000;
      return sorted.filter((e) => e.createdAt >= weekAgo);
    }
    return sorted;
  }, [entries, filter, todayStr]);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleAdd = useCallback(() => {
    const trimmed = newEntry.trim();
    if (trimmed.length === 0) return;

    const entry: JournalEntry = {
      id: `j-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: trimmed,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    setEntries((prev) => [entry, ...prev]);
    setNewEntry('');
  }, [newEntry]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd],
  );

  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleClear = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <section
      id="journal"
      ref={ref}
      className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/50"
      aria-labelledby="journal-heading"
    >
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
              Journal
            </p>
            <h2
              id="journal-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              Your subtraction log
            </h2>
            <p className="max-w-lg mx-auto text-gray-600 dark:text-gray-400">
              Track what you&apos;ve let go of. Each entry is proof that less
              creates space for more.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-2xl font-bold text-brand-500">{totalCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total subtractions
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-2xl font-bold text-brand-500">{todayCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Today
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-2xl font-bold text-brand-500">
                {streak > 0 ? streak : '—'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Day streak
              </p>
            </div>
          </div>

          {/* Add entry */}
          <div className="flex gap-2 mb-8">
            <label htmlFor="journal-input" className="sr-only">
              What did you subtract today?
            </label>
            <input
              id="journal-input"
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What did you subtract today?"
              className="flex-1 h-12 px-4 text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              maxLength={200}
            />
            <button
              onClick={handleAdd}
              disabled={newEntry.trim().length === 0}
              className="inline-flex items-center justify-center h-12 px-5 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 dark:hover:bg-brand-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Add journal entry"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Filter tabs */}
          {totalCount > 0 && (
            <div
              className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
              role="tablist"
              aria-label="Journal entries filter"
            >
              {(['all', 'today', 'week'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900 ${
                    filter === f
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  role="tab"
                  aria-selected={filter === f}
                >
                  {f === 'all'
                    ? `All (${totalCount})`
                    : f === 'today'
                      ? `Today (${todayCount})`
                      : 'This Week'}
                </button>
              ))}
            </div>
          )}

          {/* Entries list */}
          {filteredEntries.length > 0 && (
            <div className="space-y-3" role="list" aria-label="Journal entries">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  role="listitem"
                  className="group flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-500 text-sm font-medium mt-0.5"
                    aria-hidden="true"
                  >
                    −
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                      {entry.text}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900"
                    aria-label={`Delete entry: ${entry.text}`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {filteredEntries.length === 0 && (
            <div className="py-12 text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-gray-400 dark:text-gray-500"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {entries.length === 0
                  ? 'Your journal is empty. Start by logging something you let go of today.'
                  : 'No entries match this filter.'}
              </p>
            </div>
          )}

          {/* Clear all */}
          {totalCount > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleClear}
                className="text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded underline underline-offset-4"
              >
                Clear all entries
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
