import Image from "next/image";

export default function FederationMessage() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left: avatar + name */}
          <div className="flex flex-col items-center gap-3 shrink-0 w-full lg:w-auto lg:min-w-[200px]">
            <div className="relative md:mt-10 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-md overflow-hidden shadow-lg ring-4 ring-primary-100">
              <Image
                src="/assets/admin.jpg"
                alt="President of Traders Federation"
                fill
                priority
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-base">President</p>
              <p className="text-sm text-gray-600">Traders Federation</p>
              <p className="text-xs text-gray-500 mt-1">
                Bandipora, Jammu & Kashmir
              </p>
            </div>
          </div>

          {/* Right: message */}
          <div className="flex-1 lg:max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest">
                Message from the Federation
              </p>
            </div>
            <blockquote className="relative">
              <span className="absolute -top-2 -left-1 text-5xl text-primary-100 font-serif leading-none select-none">
                &ldquo;
              </span>
              <div className="relative pl-4 border-l-4 border-primary-600 space-y-3">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Welcome to the Bandipora Traders Federation, a historic first
                  for our beloved Bandipora. This is the first online platform
                  of its kind in Jammu and Kashmir, designed with the heart of
                  Bandipora at its core. We invite every trader, every
                  businessman, every person in Bandipora to share their
                  experiences, raise their concerns, and offer their ideas.
                  Together, we will strengthen Bandipora through trade, ensuring
                  that every facility needed for daily life is at your
                  fingertips. Our dream is that Bandipora becomes a beacon of
                  growth, a place where every Tehsil of Bandipora from Sonawari
                  to Hajin, from Hajin to Ajas, from Ajas to Aloosa, from Aloosa
                  to Gurez and from Gurez to Tulail to all others can come
                  together on this platform. As we pave the way for a connected,
                  informed, and prosperous Bandipora, let us hope that this
                  initiative inspires every corner of our district to dream
                  bigger, achieve more, and build a future full of
                  possibilities.
                </p>
              </div>
            </blockquote>
            <p className="mt-5 text-xs sm:text-sm text-gray-500 italic">
              — President, Traders Federation Bandipora
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
