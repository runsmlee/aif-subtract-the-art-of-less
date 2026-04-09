import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Principles } from './components/Principles';
import { BeforeAfter } from './components/BeforeAfter';
import { DailyChallenge } from './components/DailyChallenge';
import { SubtractionExercise } from './components/SubtractionExercise';
import { Quote } from './components/Quote';
import { Reflection } from './components/Reflection';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main-content" className="flex-1">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
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
        <ErrorBoundary>
          <Quote />
        </ErrorBoundary>
        <ErrorBoundary>
          <Reflection />
        </ErrorBoundary>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
