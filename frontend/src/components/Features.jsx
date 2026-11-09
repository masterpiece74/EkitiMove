function Features() {
  const features = [
    {
      icon: "📍",
      title: "Easy Route Search",
      description:
        "Quickly find routes between towns and destinations across Ekiti State.",
    },
    {
      icon: "🚗",
      title: "Multiple Transport Options",
      description:
        "Explore buses, keke, taxis, and other convenient ways to get around.",
    },
    {
      icon: "🗺️",
      title: "Explore Ekiti",
      description:
        "Discover popular destinations and plan your journey with confidence.",
    },
  ];

  return (
    <section className="px-6 py-16 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose Ekiti Move?
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Simple, reliable transport information for getting around Ekiti.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-green-50 hover:shadow-md transition duration-300"
            >

              {/* Icon */}
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-green-100 text-3xl">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-600 leading-relaxed">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;