function TransportOptions() {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Choose Your Transport
          </h2>

          <p className="mt-3 text-gray-600">
            Find the best way to move around Ekiti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Bus */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">
              
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Bus
            </h3>

            <p className="mt-2 text-gray-600">
              Find available buses and routes across Ekiti.
            </p>

            <button className="mt-6 text-green-600 font-semibold hover:text-green-700">
              Explore Buses →
            </button>
          </div>

          {/* Keke */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">
              
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Keke
            </h3>

            <p className="mt-2 text-gray-600">
              Discover nearby keke routes and transport options.
            </p>

            <button className="mt-6 text-green-600 font-semibold hover:text-green-700">
              Explore Keke →
            </button>
          </div>

          {/* Taxi */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">
              
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Taxi
            </h3>

            <p className="mt-2 text-gray-600">
              Find convenient taxi options for your journey.
            </p>

            <button className="mt-6 text-green-600 font-semibold hover:text-green-700">
              Explore Taxis →
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

export default TransportOptions;