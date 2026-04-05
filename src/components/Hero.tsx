import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function Hero() {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="section-container text-center py-24 sm:py-32">
        <p
          className={`text-sm font-medium tracking-widest uppercase text-brand-500 mb-4 transition-all duration-700 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          The Art of Less
        </p>

        <h1
          className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6 transition-all duration-700 delay-100 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          Subtract everything
          <br />
          <span className="text-brand-500">that doesn't matter.</span>
        </h1>

        <p
          className={`max-w-xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 transition-all duration-700 delay-200 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          The most powerful improvements come not from adding more, but from
          removing what stands in the way.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <a
            href="#practice"
            className="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Try the Exercise
          </a>
          <a
            href="#principles"
            className="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Learn Why
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-16 transition-all duration-700 delay-500 ${
            shouldAnimate ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
