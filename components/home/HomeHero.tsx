import Link from "next/link";

function Icon({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d={d}
      />
    </svg>
  );
}

const ICONS = {
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
  verify:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
};

export default function HomeHero() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-5 border border-primary-100">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            Official Digital Platform — Jammu & Kashmir
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Traders Federation
            <br />
            <span className="text-primary-600">Digital Platform</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mb-7 leading-relaxed max-w-2xl">
            The official platform for shop registration, certificate management,
            public notices, and financial transparency for traders across Jammu
            & Kashmir.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Register Your Shop <Icon d={ICONS.arrow} className="w-4 h-4" />
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-200 shadow-sm transition-all"
            >
              Browse Directory
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-200 shadow-sm transition-all"
            >
              <Icon d={ICONS.verify} className="w-4 h-4 text-primary-600" />{" "}
              Verify Certificate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
