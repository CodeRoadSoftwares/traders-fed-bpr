import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-linear-to-br from-primary-600 to-secondary-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Traders Federation Digital Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Transparent, Verified, and Trusted Business Community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Register Your Shop
            </Link>
            <Link
              href="/directory"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
            >
              Browse Directory
            </Link>
            <Link
              href="/verify"
              className="bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
