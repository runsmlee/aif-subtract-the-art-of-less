import { useState, useEffect } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <nav
        className="section-container flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="text-lg font-semibold tracking-tight text-gray-900 hover:text-brand-500 transition-colors duration-200"
          aria-label="Subtract — Home"
        >
          Subtract
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#principles"
            className="hidden sm:inline-block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Principles
          </a>
          <a
            href="#practice"
            className="hidden sm:inline-block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Practice
          </a>
          <a
            href="#practice"
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Start Subtracting
          </a>
        </div>
      </nav>
    </header>
  );
}
