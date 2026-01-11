export default function PlanLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 pb-24">
        <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse" />

        {/* Income Target Skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="h-5 w-40 bg-neutral-200 rounded animate-pulse mb-4" />
          <div className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
        </div>

        {/* Allocation Bar Skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="h-4 w-full bg-neutral-100 rounded-full animate-pulse mb-4" />
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Anchors Skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-5 h-5 bg-neutral-100 rounded animate-pulse" />
                <div className="flex-1 h-10 bg-neutral-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Variables Skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="h-6 w-28 bg-neutral-200 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                </div>
                <div className="h-2 bg-neutral-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Savings Skeleton */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
