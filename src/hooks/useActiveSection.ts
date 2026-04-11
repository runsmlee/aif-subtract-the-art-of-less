import { useState, useEffect, useCallback, useRef } from 'react';

const SECTION_IDS = ['principles', 'practice', 'journal', 'reflect'];

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState('');
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const scrollPosition = window.scrollY + 120;

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const element = document.getElementById(SECTION_IDS[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(SECTION_IDS[i]);
          rafRef.current = 0;
          return;
        }
      }
      setActiveSection('');
      rafRef.current = 0;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return activeSection;
}
