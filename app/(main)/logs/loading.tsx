export default function LogsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 pb-24">
        <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="h-10 bg-neutral-100 rounded-lg animate-pulse mb-4" />
          <div className="flex gap-3 flex-wrap">
            <div className="h-10 w-32 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-10 w-28 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-10 w-36 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-10 w-36 bg-neutral-100 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-neutral-100 rounded animate-pulse" />
                </div>
                <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
