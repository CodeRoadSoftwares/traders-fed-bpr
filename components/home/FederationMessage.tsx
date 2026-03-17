export default function FederationMessage() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
          {/* Left: avatar + name — row on mobile, column on sm+ */}
          <div className="flex sm:flex-col items-center gap-4 sm:gap-3 shrink-0">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
              TF
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">President</p>
              <p className="text-xs text-gray-500">Traders Federation</p>
              <p className="text-xs text-gray-400 mt-0.5">Jammu & Kashmir</p>
            </div>
          </div>

          {/* Right: message */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
                Message from the Federation
              </p>
            </div>
            <blockquote className="relative">
              <span className="absolute -top-2 -left-1 text-5xl text-primary-100 font-serif leading-none select-none">
                &ldquo;
              </span>
              <div className="relative pl-4 border-l-4 border-primary-600 space-y-2.5">
                <p className="text-gray-700 text-sm leading-relaxed">
                  On behalf of the Traders Federation of Jammu & Kashmir, I
                  welcome you to our official digital platform. This portal has
                  been established to bring transparency, accountability, and
                  ease of access to every registered trader in our region.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Through this platform, traders can register their shops,
                  obtain digital certificates, stay informed through official
                  notices, and access financial records of the federation. We
                  are committed to building a stronger, more connected trading
                  community across all districts of Jammu & Kashmir.
                </p>
              </div>
            </blockquote>
            <p className="mt-4 text-xs text-gray-400 italic">
              — President, Traders Federation J&K
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
