import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getLocalDateStr } from '../utils/date';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'complete';

interface PhaseConfig {
  label: string;
  duration: number;
  instruction: string;
}

const PHASES: Record<Exclude<Phase, 'idle' | 'complete'>, PhaseConfig> = {
  inhale: { label: 'Breathe In', duration: 4000, instruction: 'Slowly draw breath in' },
  hold: { label: 'Hold', duration: 4000, instruction: 'Rest in stillness' },
  exhale: { label: 'Breathe Out', duration: 6000, instruction: 'Let everything go' },
};

const PHASE_ORDER: Exclude<Phase, 'idle' | 'complete'>[] = ['inhale', 'hold', 'exhale'];
const TOTAL_CYCLES = 3;

const SESSIONS_STORAGE_KEY = 'subtract-mindful-sessions';

interface SessionRecord {
  date: string;
  cycles: number;
  completedAt: number;
}

function loadSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e: unknown): e is SessionRecord =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as Record<string, unknown>).date === 'string' &&
        typeof (e as Record<string, unknown>).cycles === 'number' &&
        typeof (e as Record<string, unknown>).completedAt === 'number',
    );
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionRecord[]): void {
  if (sessions.length === 0) {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
  } else {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions.slice(-30)));
  }
}

function getTodayCount(sessions: SessionRecord[]): number {
  const today = getLocalDateStr();
  return sessions.filter((s) => s.date === today).length;
}

function formatDuration(ms: number): string {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function MindfulBreak() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [sessions, setSessions] = useState<SessionRecord[]>(() => loadSessions());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  // Use refs to track current phase/cycle inside the interval callback
  // to avoid stale closures from React batching
  const phaseRef = useRef<Phase>('idle');
  const cycleRef = useRef(0);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  const isActive = phase !== 'idle' && phase !== 'complete';

  // Keep refs in sync with state
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    cycleRef.current = cycle;
  }, [cycle]);

  // Persist sessions
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Timer logic — runs once, reads refs for current values
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const diff = now - startTimeRef.current;
      setElapsed(diff);

      const currentPhase = phaseRef.current;
      const currentCycle = cycleRef.current;
      const currentPhaseConfig = PHASES[currentPhase as Exclude<Phase, 'idle' | 'complete'>];

      if (!currentPhaseConfig || diff < currentPhaseConfig.duration) return;

      const currentPhaseIndex = PHASE_ORDER.indexOf(currentPhase as Exclude<Phase, 'idle' | 'complete'>);

      if (currentPhaseIndex < PHASE_ORDER.length - 1) {
        // Move to next phase in cycle
        const nextPhase = PHASE_ORDER[currentPhaseIndex + 1];
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      } else {
        // End of cycle
        const nextCycle = currentCycle + 1;
        if (nextCycle >= TOTAL_CYCLES) {
          phaseRef.current = 'complete';
          cycleRef.current = nextCycle;
          setPhase('complete');
          setCycle(nextCycle);
          const session: SessionRecord = {
            date: getLocalDateStr(),
            cycles: TOTAL_CYCLES,
            completedAt: Date.now(),
          };
          setSessions((prev) => [...prev, session]);
        } else {
          cycleRef.current = nextCycle;
          phaseRef.current = 'inhale';
          setCycle(nextCycle);
          setPhase('inhale');
        }
      }
      startTimeRef.current = now;
      setElapsed(0);
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // Only depend on isActive so we start/stop the timer
    // phase/cycle changes are tracked via refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleStart = useCallback(() => {
    setPhase('inhale');
    setCycle(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
  }, []);

  const handleStop = useCallback(() => {
    setPhase('idle');
    setCycle(0);
    setElapsed(0);
  }, []);

  const currentPhaseConfig = phase !== 'idle' && phase !== 'complete'
    ? PHASES[phase as Exclude<Phase, 'idle' | 'complete'>]
    : null;

  const progressPercent = currentPhaseConfig
    ? Math.min((elapsed / currentPhaseConfig.duration) * 100, 100)
    : 0;

  const overallProgress = phase === 'complete'
    ? 100
    : isActive
      ? Math.round(((cycle * PHASE_ORDER.length + PHASE_ORDER.indexOf(phase)) / (TOTAL_CYCLES * PHASE_ORDER.length)) * 100)
      : 0;

  const todaySessions = getTodayCount(sessions);
  const totalSessions = sessions.length;

  // Circle radius for SVG breathing indicator
  const baseRadius = 40;
  const radius = isActive && currentPhaseConfig
    ? phase === 'inhale'
      ? baseRadius + (elapsed / currentPhaseConfig.duration) * 16
      : phase === 'exhale'
        ? baseRadius + 16 - (elapsed / currentPhaseConfig.duration) * 16
        : baseRadius + 16
    : baseRadius;

  return (
    <section
      ref={ref}
      className="py-20 sm:py-28"
      aria-labelledby="mindful-heading"
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
              Pause
            </p>
            <h2
              id="mindful-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              A mindful minute
            </h2>
            <p className="max-w-lg mx-auto text-gray-600 dark:text-gray-400">
              Before subtracting more, create space. Three cycles of breathing
              to clear your mind.
            </p>
          </div>

          {/* Breathing exercise card */}
          <div className="relative p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* Central breathing indicator */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center"
                role="img"
                aria-label={
                  phase === 'idle'
                    ? 'Ready to begin breathing exercise'
                    : phase === 'complete'
                      ? 'Breathing exercise complete'
                      : `Phase: ${currentPhaseConfig?.label ?? phase}`
                }
              >
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r={baseRadius + 16}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-gray-100 dark:text-gray-800"
                  />
                  {/* Progress arc */}
                  {isActive && (
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${(progressPercent / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                      className="transition-all duration-100"
                      style={{ transformOrigin: 'center' }}
                    />
                  )}
                  {/* Main breathing circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={phase === 'complete' ? '#EF4444' : isActive ? '#EF4444' : 'currentColor'}
                    strokeWidth={isActive ? 1.5 : 1}
                    className={`transition-all duration-100 ${
                      phase === 'idle' ? 'text-gray-200 dark:text-gray-700' : ''
                    }`}
                    style={{
                      fill: phase === 'complete' ? 'rgba(239, 68, 68, 0.05)' : 'none',
                    }}
                  />
                  {/* Center text */}
                  {isActive && (
                    <text
                      x="60"
                      y="56"
                      textAnchor="middle"
                      className="text-[8px] font-medium fill-gray-500 dark:fill-gray-400"
                    >
                      {currentPhaseConfig?.label}
                    </text>
                  )}
                  {isActive && (
                    <text
                      x="60"
                      y="68"
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-brand-500"
                    >
                      {Math.max(0, Math.ceil((currentPhaseConfig!.duration - elapsed) / 1000))}s
                    </text>
                  )}
                  {phase === 'idle' && (
                    <text
                      x="60"
                      y="63"
                      textAnchor="middle"
                      className="text-[10px] font-medium fill-gray-300 dark:fill-gray-600"
                    >
                      Ready
                    </text>
                  )}
                  {phase === 'complete' && (
                    <>
                      <text x="60" y="56" textAnchor="middle" className="text-[9px] font-bold fill-brand-500">
                        Done
                      </text>
                      <text x="60" y="68" textAnchor="middle" className="text-[7px] fill-gray-400 dark:fill-gray-500">
                        Space created
                      </text>
                    </>
                  )}
                </svg>
              </div>

              {/* Phase instruction */}
              <p
                className="mt-4 text-sm text-gray-500 dark:text-gray-400 h-5"
                aria-live="polite"
              >
                {phase === 'idle'
                  ? 'Press start to begin 3 breathing cycles'
                  : phase === 'complete'
                    ? 'Well done. You created space for clarity.'
                    : currentPhaseConfig?.instruction}
              </p>
            </div>

            {/* Cycle indicators */}
            <div
              className="flex items-center justify-center gap-3 mb-6"
              role="group"
              aria-label={`Cycle progress: ${cycle + (phase === 'complete' ? 0 : isActive ? 1 : 0)} of ${TOTAL_CYCLES}`}
            >
              {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    i < cycle || (i === cycle && phase === 'complete')
                      ? 'bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400'
                      : i === cycle && isActive
                        ? 'bg-brand-50 dark:bg-brand-950 text-brand-500 ring-1 ring-brand-300 dark:ring-brand-700'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  }`}
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  Cycle {i + 1}
                </div>
              ))}
            </div>

            {/* Overall progress bar */}
            {isActive && (
              <div
                className="mb-6"
                role="progressbar"
                aria-valuenow={overallProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Overall breathing exercise progress"
              >
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {phase === 'idle' && (
                <button
                  onClick={handleStart}
                  className="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 active:bg-brand-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="mr-2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Begin Breathing
                </button>
              )}

              {isActive && (
                <button
                  onClick={handleStop}
                  className="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="mr-2"
                    aria-hidden="true"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Pause
                </button>
              )}

              {phase === 'complete' && (
                <button
                  onClick={handleStart}
                  className="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 active:bg-brand-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Breathe Again
                </button>
              )}
            </div>
          </div>

          {/* Session stats */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-2xl font-bold text-brand-500">{todaySessions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sessions today
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
              <p className="text-2xl font-bold text-brand-500">{totalSessions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total sessions
              </p>
            </div>
          </div>

          {/* Insight text */}
          {phase === 'complete' && (
            <div
              className="mt-6 p-5 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-800 text-center"
              role="status"
              aria-live="polite"
            >
              <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
                The space between thoughts is where clarity lives.
              </p>
              <p className="text-xs text-brand-500/70 dark:text-brand-400/70 mt-1">
                {formatDuration(TOTAL_CYCLES * (PHASES.inhale.duration + PHASES.hold.duration + PHASES.exhale.duration))} of mindful presence
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
