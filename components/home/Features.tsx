export default function Features() {
  const features = [
    {
      title: "Digital Certificates",
      description:
        "Verified online certificates with QR codes for instant verification. No more paper hassle.",
      icon: "📜",
    },
    {
      title: "Public Noticeboard",
      description:
        "Stay updated with instant notices. Urgent alerts sent directly to your email.",
      icon: "📢",
    },
    {
      title: "Funds Transparency",
      description:
        "See exactly how money is collected and spent. Monthly and quarterly reports available.",
      icon: "💰",
    },
    {
      title: "Verified Directory",
      description:
        "Find genuine registered businesses. Search by category, name, or area.",
      icon: "🏪",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
