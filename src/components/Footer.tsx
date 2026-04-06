export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-gray-100 dark:border-gray-800" role="contentinfo">
      <div className="section-container">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Subtract
            </span>
            <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">
              —
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">The Art of Less</span>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li>
                <a
                  href="#principles"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Principles
                </a>
              </li>
              <li>
                <a
                  href="#practice"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Practice
                </a>
              </li>
              <li>
                <a
                  href="#reflect"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Reflect
                </a>
              </li>
            </ul>
          </nav>

          {/* Divider */}
          <div className="w-12 h-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

          {/* Copyright */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            &copy; {currentYear} Subtract. Less is more.
          </p>
        </div>
      </div>
    </footer>
  );
}
