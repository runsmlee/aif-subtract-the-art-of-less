import { useState, useCallback, useMemo } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

const allReflectionPrompts = [
  'What would your day look like with three fewer commitments?',
  'Which project would benefit most from removing a feature?',
  'What conversation have you been avoiding by staying busy?',
  'If you could only keep one hobby, which would survive?',
  'What belief have you outgrown but haven\'t let go of yet?',
  'Which of your daily habits adds the least value?',
  'What would you create if nobody needed to see it?',
  'What relationship drains more energy than it gives?',
  'What rule do you follow that no longer serves you?',
  'If your schedule had one blank hour, what would you do with it?',
];

function getRandomPrompts(count: number, exclude?: number[]): number[] {
  const available = Array.from({ length: allReflectionPrompts.length }, (_, i) => i)
    .filter((i) => !exclude?.includes(i));

  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function Reflection() {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [usedPromptIndices, setUsedPromptIndices] = useState<number[]>([]);
  const [currentPromptIndices, setCurrentPromptIndices] = useState<number[]>(() =>
    getRandomPrompts(3),
  );
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const currentPrompts = useMemo(
    () => currentPromptIndices.map((i) => allReflectionPrompts[i]),
    [currentPromptIndices],
  );

  const handlePromptSelect = useCallback((displayIndex: number) => {
    setSelectedPromptIndex(displayIndex);
    setReflection('');
    setIsSubmitted(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (reflection.trim().length > 0) {
      setIsSubmitted(true);
      if (selectedPromptIndex !== null) {
        setUsedPromptIndices((prev) => [...prev, currentPromptIndices[selectedPromptIndex]]);
      }
    }
  }, [reflection, selectedPromptIndex, currentPromptIndices]);

  const handleNewPrompts = useCallback(() => {
    const newIndices = getRandomPrompts(3, usedPromptIndices);
    setCurrentPromptIndices(newIndices);
    setSelectedPromptIndex(null);
    setReflection('');
    setIsSubmitted(false);
  }, [usedPromptIndices]);

  const handleWriteAnother = useCallback(() => {
    const newIndices = getRandomPrompts(3, usedPromptIndices);
    setCurrentPromptIndices(newIndices);
    setSelectedPromptIndex(null);
    setReflection('');
    setIsSubmitted(false);
  }, [usedPromptIndices]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <section
      id="reflect"
      ref={ref}
      className="py-20 sm:py-28 bg-white dark:bg-gray-950"
      aria-labelledby="reflect-heading"
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
              Reflect
            </p>
            <h2
              id="reflect-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              What remains when you subtract?
            </h2>
            <p className="max-w-lg mx-auto text-gray-600 dark:text-gray-400">
              Choose a prompt and write freely. No right answers — just honest
              reflection.
            </p>
          </div>

          {/* Prompt selection */}
          <div className="space-y-3 mb-8" role="radiogroup" aria-label="Reflection prompts">
            {currentPrompts.map((prompt, index) => (
              <button
                key={prompt}
                onClick={() => handlePromptSelect(index)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
                  selectedPromptIndex === index
                    ? 'border-brand-300 dark:border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-200'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                role="radio"
                aria-checked={selectedPromptIndex === index}
              >
                <span className="text-sm font-medium">{prompt}</span>
              </button>
            ))}
          </div>

          {/* Refresh prompts button */}
          <div className="text-center mb-8">
            <button
              onClick={handleNewPrompts}
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950 rounded"
              aria-label="Get new reflection prompts"
            >
              Show different prompts →
            </button>
          </div>

          {/* Reflection input */}
          {selectedPromptIndex !== null && !isSubmitted && (
            <div className="space-y-4 animate-fade-in">
              <label htmlFor="reflection-input" className="sr-only">
                Write your reflection
              </label>
              <textarea
                id="reflection-input"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your thoughts here..."
                rows={4}
                className="w-full p-4 text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {reflection.length}/500 · Press Ctrl+Enter to submit
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={reflection.trim().length === 0}
                  className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                >
                  Save Reflection
                </button>
              </div>
            </div>
          )}

          {/* Submitted state */}
          {isSubmitted && (
            <div className="p-6 sm:p-8 bg-brand-50 dark:bg-brand-950 rounded-2xl border border-brand-100 dark:border-brand-800 text-center animate-scale-in">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-brand-700 dark:text-brand-300 font-medium text-lg mb-2">
                Reflection saved.
              </p>
              <p className="text-brand-600 dark:text-brand-400 text-sm mb-6">
                The act of reflecting is itself an act of subtraction — you&apos;ve
                distilled a complex thought into something clear.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleWriteAnother}
                  className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-900 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                >
                  Write another reflection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
