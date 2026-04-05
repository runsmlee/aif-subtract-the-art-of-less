import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Principle {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const principles: Principle[] = [
  {
    id: 'remove',
    icon: '−',
    title: "Remove, don't add",
    description:
      'Before adding a new feature, habit, or commitment, ask: what can I remove instead? Subtraction is the undervalued path to improvement.',
  },
  {
    id: 'essential',
    icon: '◎',
    title: 'Find the essential',
    description:
      'Strip away the decorative, the habitual, and the expected. What remains when everything unnecessary is gone? That\'s your core.',
  },
  {
    id: 'clarity',
    icon: '○',
    title: 'Clarity through constraint',
    description:
      "Constraints don't limit creativity — they reveal it. When you have less to work with, you find more meaningful solutions.",
  },
  {
    id: 'space',
    icon: '◌',
    title: 'Value the space between',
    description:
      'In music, silence defines melody. In design, whitespace defines form. In life, rest defines purpose. Emptiness is not absence — it\'s potential.',
  },
];

function PrincipleCard({
  principle,
  index,
}: {
  principle: Principle;
  index: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion && isInView;

  return (
    <article
      ref={ref}
      className={`group p-6 sm:p-8 rounded-2xl border border-gray-100 bg-white hover:border-brand-200 hover:shadow-sm transition-all duration-300 ${
        shouldAnimate
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: prefersReducedMotion ? '0ms' : `${index * 100}ms` }}
      aria-labelledby={`principle-title-${principle.id}`}
    >
      <div
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-50 text-brand-500 text-xl font-bold mb-5 group-hover:bg-brand-100 transition-colors duration-200"
        aria-hidden="true"
      >
        {principle.icon}
      </div>
      <h3
        id={`principle-title-${principle.id}`}
        className="text-lg font-semibold text-gray-900 mb-3"
      >
        {principle.title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{principle.description}</p>
    </article>
  );
}

export function Principles() {
  return (
    <section
      id="principles"
      className="py-20 sm:py-28 bg-gray-50/50"
      aria-labelledby="principles-heading"
    >
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="text-sm font-medium tracking-widest uppercase text-brand-500 mb-3">
            Philosophy
          </p>
          <h2
            id="principles-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Four principles of less
          </h2>
          <p className="max-w-lg mx-auto text-gray-600">
            Not a rigid framework — a way of seeing. These principles guide
            every decision toward simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {principles.map((principle, index) => (
            <PrincipleCard
              key={principle.id}
              principle={principle}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
