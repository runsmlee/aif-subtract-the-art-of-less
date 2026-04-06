import { useState, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

function SubtractionVisual({ shouldAnimate }: { shouldAnimate: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [800, 1600, 2400, 3200];

    delays.forEach((delay, index) => {
      timers.push(setTimeout(() => setStep(index + 1), delay));
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [shouldAnimate]);

  return (
    <div className="relative w-full max-w-xs mx-auto mb-12" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="w-full h-auto">
        {/* Background clutter - shapes that fade out progressively */}
        <circle
          cx="40" cy="60" r="15"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-700 transition-all duration-700"
          opacity={step < 1 ? 0.6 : 0}
        />
        <rect
          x="140" y="40" width="20" height="20" rx="3"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-700 transition-all duration-700"
          opacity={step < 1 ? 0.6 : 0}
          transform="rotate(15 150 50)"
        />
        <line
          x1="30" y1="140" x2="70" y2="160"
          stroke="currentColor" strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-700 transition-all duration-700"
          opacity={step < 2 ? 0.5 : 0}
        />
        <circle
          cx="160" cy="150" r="10"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-700 transition-all duration-700"
          opacity={step < 2 ? 0.5 : 0}
        />
        <polygon
          points="45,120 55,140 35,140"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-700 transition-all duration-700"
          opacity={step < 3 ? 0.4 : 0}
        />
        <rect
          x="130" y="130" width="15" height="15" rx="2"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-gray-300 dark:text-gray-700 transition-all duration-700"
          opacity={step < 3 ? 0.4 : 0}
          transform="rotate(-10 137 137)"
        />

        {/* Core element - the brand circle that remains */}
        <circle
          cx="100" cy="100"
          r={step >= 4 ? 35 : 20}
          fill="none" stroke="#EF4444" strokeWidth="2"
          className="transition-all duration-1000"
          opacity={step >= 4 ? 1 : 0.3}
        />

        {/* Center dot - the essential */}
        <circle
          cx="100" cy="100" r="4"
          fill="#EF4444"
          className="transition-all duration-1000"
          opacity={step >= 4 ? 1 : 0}
        />
      </svg>
    </div>
  );
}

export function Hero() {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="section-container text-center py-20 sm:py-28">
        {/* Visual subtraction animation */}
        <div
          className={`transition-all duration-1000 ${
            shouldAnimate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <SubtractionVisual shouldAnimate={shouldAnimate} />
        </div>

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
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.1] mb-6 transition-all duration-700 delay-100 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          Subtract everything
          <br />
          <span className="text-brand-500">that doesn&apos;t matter.</span>
        </h1>

        <p
          className={`max-w-xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 transition-all duration-700 delay-200 ${
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
            className="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 active:bg-brand-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            Try the Exercise
          </a>
          <a
            href="#principles"
            className="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            Learn Why
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-12 transition-all duration-700 delay-500 ${
            shouldAnimate ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
