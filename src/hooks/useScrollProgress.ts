import { useState, useEffect, useCallback } from 'react';

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(Math.min(currentProgress, 1));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return progress;
}
