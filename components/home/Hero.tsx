"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-success-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-warning-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md mb-8">
            <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">
              Digital Platform for Traders
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Traders Federation
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A transparent, digital platform for shop registration, certificate
            management, and community engagement. Join us in building a verified
            business ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/directory"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
            >
              Browse Directory
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Registered Shops", value: "500+" },
              { label: "Active Certificates", value: "450+" },
              { label: "Public Notices", value: "100+" },
              { label: "Transparency", value: "100%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
