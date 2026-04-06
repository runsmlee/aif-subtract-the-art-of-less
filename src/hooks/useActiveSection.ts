import { useState, useEffect, useCallback } from 'react';

const SECTION_IDS = ['principles', 'practice', 'reflect'];

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState('');

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 120;

    for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
      const element = document.getElementById(SECTION_IDS[i]);
      if (element && element.offsetTop <= scrollPosition) {
        setActiveSection(SECTION_IDS[i]);
        return;
      }
    }
    setActiveSection('');
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return activeSection;
}
