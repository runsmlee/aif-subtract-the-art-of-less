export function SectionSkeleton() {
  return (
    <div className="py-20 sm:py-28" aria-hidden="true">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-8 w-64 bg-gray-100 dark:bg-gray-800 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-80 bg-gray-100 dark:bg-gray-800 rounded mx-auto animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse" />
            <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse" />
            <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
