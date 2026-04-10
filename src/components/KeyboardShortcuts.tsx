import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ShortcutItem {
  keys: string[];
  description: string;
}

const shortcuts: ShortcutItem[] = [
  { keys: ['1', '–', '9'], description: 'Subtract items in the exercise' },
  { keys: ['?'], description: 'Toggle this shortcuts panel' },
  { keys: ['Esc'], description: 'Close dialogs and menus' },
  { keys: ['T'], description: 'Toggle dark/light theme' },
  { keys: ['←', '→'], description: 'Navigate quotes' },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        togglePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel]);

  if (!isOpen) {
    return (
      <button
        onClick={togglePanel}
        className="fixed bottom-6 left-6 z-40 w-11 h-11 flex items-center justify-center rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <span className="text-sm font-mono font-bold" aria-hidden="true">
          ?
        </span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${
          prefersReducedMotion ? '' : 'animate-fade-in'
        }`}
        onClick={togglePanel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 ${
          prefersReducedMotion ? '' : 'animate-scale-in'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Keyboard shortcuts
          </h3>
          <button
            onClick={togglePanel}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Close shortcuts panel"
          >
            <svg
              width="16"
              height="16"
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

        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.description}
              </span>
              <div className="flex gap-1 flex-shrink-0">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-xs font-mono font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-gray-400 dark:text-gray-500 text-center">
          Press <kbd className="font-mono">?</kbd> to toggle this panel
        </p>
      </div>
    </div>
  );
}
