export default function Features() {
  const features = [
    {
      icon: "📜",
      title: "Digital Certificates",
      description:
        "Get verified digital certificates with unique IDs and QR codes for instant verification.",
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
    },
    {
      icon: "📢",
      title: "Public Noticeboard",
      description:
        "Stay updated with important announcements and urgent alerts delivered directly to your email.",
      color: "from-warning-500 to-warning-600",
      bgColor: "bg-warning-50",
    },
    {
      icon: "💰",
      title: "Funds Transparency",
      description:
        "View detailed income and expense reports with complete transparency and accountability.",
      color: "from-success-500 to-success-600",
      bgColor: "bg-success-50",
    },
    {
      icon: "🔍",
      title: "Verified Directory",
      description:
        "Search and discover genuine, registered businesses with complete profile information.",
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
    },
  ];

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides all the tools you need to manage your business
            and stay connected with the federation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div
                className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
