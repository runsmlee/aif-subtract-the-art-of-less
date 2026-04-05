export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-gray-100" role="contentinfo">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              Subtract
            </span>
            <span className="text-gray-300" aria-hidden="true">
              —
            </span>
            <span className="text-sm text-gray-500">The Art of Less</span>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="#principles"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Principles
                </a>
              </li>
              <li>
                <a
                  href="#practice"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Practice
                </a>
              </li>
            </ul>
          </nav>

          <p className="text-sm text-gray-400">
            &copy; {currentYear} Subtract
          </p>
        </div>
      </div>
    </footer>
  );
}
