import { useState, useEffect, useCallback } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

interface NavLinkProps {
  href: string;
  children: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavLink({ href, children, isActive, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-sm transition-colors duration-200 ${
        isActive
          ? 'text-brand-500 font-medium'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      {children}
    </a>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    const focusableElements = mobileMenu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabTrap);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTabTrap);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm'
          : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm'
      }`}
      role="banner"
    >
      <nav
        className="section-container flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        <a
          href="#"
          className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
          aria-label="Subtract — Home"
        >
          Subtract
        </a>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-6">
          <NavLink href="#principles" isActive={activeSection === 'principles'}>
            Principles
          </NavLink>
          <NavLink href="#practice" isActive={activeSection === 'practice'}>
            Practice
          </NavLink>
          <NavLink href="#reflect" isActive={activeSection === 'reflect'}>
            Reflect
          </NavLink>
          <ThemeToggle />
          <a
            href="#practice"
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
          >
            Start Subtracting
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          prefersReducedMotion ? '' : 'ease-out'
        } ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="section-container pb-6 pt-2 space-y-1 border-t border-gray-100 dark:border-gray-800">
          <a
            href="#principles"
            onClick={closeMobileMenu}
            className={`block py-3 px-4 text-base rounded-lg transition-colors duration-200 ${
              activeSection === 'principles'
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-950 dark:text-brand-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950'
            }`}
            role="menuitem"
          >
            Principles
          </a>
          <a
            href="#practice"
            onClick={closeMobileMenu}
            className={`block py-3 px-4 text-base rounded-lg transition-colors duration-200 ${
              activeSection === 'practice'
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-950 dark:text-brand-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950'
            }`}
            role="menuitem"
          >
            Practice
          </a>
          <a
            href="#reflect"
            onClick={closeMobileMenu}
            className={`block py-3 px-4 text-base rounded-lg transition-colors duration-200 ${
              activeSection === 'reflect'
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-950 dark:text-brand-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950'
            }`}
            role="menuitem"
          >
            Reflect
          </a>
          <div className="pt-2">
            <a
              href="#practice"
              onClick={closeMobileMenu}
              className="block text-center py-3 px-4 text-base font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors duration-200"
              role="menuitem"
            >
              Start Subtracting
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
