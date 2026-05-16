import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Principles } from './components/Principles';
import { BeforeAfter } from './components/BeforeAfter';
import { DailyChallenge } from './components/DailyChallenge';
import { SubtractionExercise } from './components/SubtractionExercise';
import { SubtractionJournal } from './components/SubtractionJournal';
import { Quote } from './components/Quote';
import { Reflection } from './components/Reflection';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { ProgressTracker } from './components/ProgressTracker';
import { useTheme } from './context/ThemeContext';
import { useEffect, useCallback } from 'react';

function GlobalShortcuts() {
  const { toggleTheme } = useTheme();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      }
    },
    [toggleTheme],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
}

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <GlobalShortcuts />
      <ScrollProgress />
      <Header />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <ErrorBoundary>
          <ProgressTracker />
        </ErrorBoundary>
        <div className="section-divider" aria-hidden="true" />
        <ErrorBoundary>
          <Principles />
        </ErrorBoundary>
        <div className="section-divider" aria-hidden="true" />
        <ErrorBoundary>
          <DailyChallenge />
        </ErrorBoundary>
        <ErrorBoundary>
          <BeforeAfter />
        </ErrorBoundary>
        <ErrorBoundary>
          <SubtractionExercise />
        </ErrorBoundary>
        <div className="section-divider" aria-hidden="true" />
        <ErrorBoundary>
          <SubtractionJournal />
        </ErrorBoundary>
        <ErrorBoundary>
          <Quote />
        </ErrorBoundary>
        <ErrorBoundary>
          <Reflection />
        </ErrorBoundary>
      </main>
      <Footer />
      <ScrollToTop />
      <KeyboardShortcuts />
    </div>
  );
}
