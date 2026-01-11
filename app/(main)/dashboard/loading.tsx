export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background h-screen overflow-hidden">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-8">
        <section className="text-center py-8 relative pt-12">
          <div className="inline-flex flex-col items-center">
            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse mb-4" />
            <div className="h-16 w-64 bg-neutral-200 rounded animate-pulse" />
          </div>
        </section>

        <section className="w-full bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse mb-6" />
          <div className="h-48 bg-neutral-100 rounded-xl animate-pulse" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-neutral-100 rounded animate-pulse"
                />
              ))}
            </div>
          </section>
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="h-6 w-24 bg-neutral-200 rounded animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-neutral-100 rounded animate-pulse"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
