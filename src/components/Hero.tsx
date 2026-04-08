import { useState, useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

function AnimatedCounter({ target, duration = 1500, shouldStart }: { target: number; duration?: number; shouldStart: boolean }) {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!shouldStart || prefersReducedMotion) {
      if (shouldStart) setCount(target);
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [shouldStart, target, duration, prefersReducedMotion]);

  return <span>{count}</span>;
}

interface FloatingShape {
  id: number;
  cx: number;
  cy: number;
  r: number;
  type: 'circle' | 'rect' | 'triangle';
  rotation: number;
}

const floatingShapes: FloatingShape[] = [
  { id: 1, cx: 40, cy: 60, r: 15, type: 'circle', rotation: 0 },
  { id: 2, cx: 155, cy: 45, r: 12, type: 'rect', rotation: 15 },
  { id: 3, cx: 30, cy: 145, r: 10, type: 'circle', rotation: 0 },
  { id: 4, cx: 165, cy: 155, r: 10, type: 'circle', rotation: 0 },
  { id: 5, cx: 50, cy: 125, r: 8, type: 'triangle', rotation: 0 },
  { id: 6, cx: 140, cy: 135, r: 9, type: 'rect', rotation: -10 },
  { id: 7, cx: 75, cy: 40, r: 7, type: 'triangle', rotation: 30 },
  { id: 8, cx: 130, cy: 70, r: 6, type: 'circle', rotation: 0 },
];

function SubtractionVisual({ shouldAnimate }: { shouldAnimate: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [600, 1200, 1800, 2400, 3000, 3600, 4200, 4800];

    // Shapes disappear in waves
    const waveSizes = [2, 2, 2, 2];
    let delayIndex = 0;

    waveSizes.forEach((waveSize, waveIndex) => {
      for (let i = 0; i < waveSize && delayIndex < delays.length; i++) {
        timers.push(
          setTimeout(() => setStep(waveIndex + 1), delays[delayIndex])
        );
        delayIndex++;
      }
    });

    // Final reveal
    timers.push(setTimeout(() => setStep(5), 5400));

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [shouldAnimate]);

  return (
    <div className="relative w-full max-w-xs mx-auto mb-12" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="w-full h-auto">
        {/* Floating shapes that fade out in waves */}
        {floatingShapes.map((shape, index) => {
          const wave = Math.floor(index / 2) + 1;
          const opacity = step < wave ? 0.6 - wave * 0.05 : 0;
          const scale = step < wave ? 1 : 1.3;
          const className = `text-gray-300 dark:text-gray-700 transition-all duration-700`;

          if (shape.type === 'circle') {
            return (
              <circle
                key={shape.id}
                cx={shape.cx}
                cy={shape.cy}
                r={shape.r * scale}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={className}
                opacity={opacity}
              />
            );
          }

          if (shape.type === 'rect') {
            return (
              <rect
                key={shape.id}
                x={shape.cx - shape.r}
                y={shape.cy - shape.r}
                width={shape.r * 2}
                height={shape.r * 2}
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={className}
                opacity={opacity}
                transform={`rotate(${shape.rotation} ${shape.cx} ${shape.cy})`}
              />
            );
          }

          // triangle
          const s = shape.r;
          const points = `${shape.cx},${shape.cy - s} ${shape.cx + s},${shape.cy + s} ${shape.cx - s},${shape.cy + s}`;
          return (
            <polygon
              key={shape.id}
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={className}
              opacity={opacity}
            />
          );
        })}

        {/* Core element — the brand circle that grows */}
        <circle
          cx="100"
          cy="100"
          r={step >= 5 ? 35 : 20}
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
          className="transition-all duration-1000"
          opacity={step >= 5 ? 1 : 0.25}
        />

        {/* Inner glow ring */}
        <circle
          cx="100"
          cy="100"
          r={step >= 5 ? 28 : 12}
          fill="none"
          stroke="#EF4444"
          strokeWidth="0.5"
          className="transition-all duration-1000 delay-200"
          opacity={step >= 5 ? 0.4 : 0}
        />

        {/* Center dot — the essential */}
        <circle
          cx="100"
          cy="100"
          r="4"
          fill="#EF4444"
          className="transition-all duration-1000 delay-300"
          opacity={step >= 5 ? 1 : 0}
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
      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Gradient accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="section-container text-center py-20 sm:py-28 relative z-10">
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

        {/* Impact numbers */}
        <div
          className={`mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto transition-all duration-700 delay-500 ${
            shouldAnimate
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-brand-500">
              <AnimatedCounter target={8} shouldStart={shouldAnimate} />
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">things to let go</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-brand-500">
              <AnimatedCounter target={4} shouldStart={shouldAnimate} />
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">core principles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-brand-500">
              ∞
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">potential unlocked</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`mt-12 transition-all duration-700 delay-700 ${
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
