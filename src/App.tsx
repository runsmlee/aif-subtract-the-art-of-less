import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Principles } from './components/Principles';
import { SubtractionExercise } from './components/SubtractionExercise';
import { Quote } from './components/Quote';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Principles />
        <SubtractionExercise />
        <Quote />
      </main>
      <Footer />
    </div>
  );
}
