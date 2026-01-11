export default function StatsLayout() {
  return (
    <section className="bg-accent/30 dark:bg-surface-dark py-32 relative overflow-hidden">
      {/* --- Background Geometry: Radar Rings --- */}
      {/* Thin, precise lines to suggest 'Scanning' or 'Security' */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border border-gray-200 dark:border-gray-800 rounded-full opacity-60"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-dashed border-gray-300 dark:border-gray-700 rounded-full opacity-60 animate-[spin_60s_linear_infinite]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 border border-gray-200 dark:border-gray-800 rounded-full opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* --- Header --- */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-white dark:bg-gray-900 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
              Live System Data
            </span>
          </div>
          s
          <h2 className="text-4xl md:text-5xl font-black text-primary dark:text-white mb-6 uppercase leading-tight">
            The foundation for <br className="hidden md:block" />
            <span className="bg-primary text-white px-2 box-decoration-clone">
              financial freedom
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
            Join thousands of users who have transformed their financial health.
            We analyze millions of transactions securely to give you the best
            insights.
          </p>
        </div>

        {/* --- The Stats "Foundation" Block --- */}
        {/* A solid, joined container that looks like a dashboard widget */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl border-2 border-primary/10 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
            {/* Stat 1: Users */}
            <div className="p-10 group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300 relative">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  +12% this week
                </span>
              </div>
              <div className="mb-4 text-primary/20 group-hover:text-primary transition-colors duration-300">
                {/* Simple User Icon */}
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-primary dark:text-white mb-2 tracking-tight">
                10k<span className="text-3xl text-primary/40">+</span>
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Active Members
              </div>
            </div>

            {/* Stat 2: Money (Center - Highlighted) */}
            <div className="p-10 relative group bg-tertiary/5 hover:bg-tertiary/10 transition-colors duration-300">
              <div className="mb-4 text-primary/20 group-hover:text-primary transition-colors duration-300">
                {/* Chart/Money Icon */}
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-primary dark:text-white mb-2 tracking-tight">
                $5M<span className="text-3xl text-primary/40">+</span>
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-widest">
                Assets Tracked
              </div>
              {/* Bottom decorative bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            {/* Stat 3: Rating */}
            <div className="p-10 group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300 relative">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  Top Rated
                </span>
              </div>
              <div className="mb-4 text-primary/20 group-hover:text-yellow-500 transition-colors duration-300">
                {/* Star Icon */}
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div className="text-5xl font-black text-primary dark:text-white mb-2 tracking-tight">
                4.9<span className="text-2xl text-gray-300">/5</span>
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                App Store Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
