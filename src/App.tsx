import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Principles } from './components/Principles';
import { SubtractionExercise } from './components/SubtractionExercise';
import { Quote } from './components/Quote';
import { Reflection } from './components/Reflection';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Principles />
        <SubtractionExercise />
        <Quote />
        <Reflection />
      </main>
      <Footer />
    </div>
  );
}
