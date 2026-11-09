function PopularRoutes() {
  const routes = [
    {
      from: "Ado-Ekiti",
      to: "Ikere-Ekiti",
      price: "₦1,000",
    },
    {
      from: "Ado-Ekiti",
      to: "Ifaki-Ekiti",
      price: "₦800",
    },
    {
      from: "Ado-Ekiti",
      to: "Ijero-Ekiti",
      price: "₦700",
    },
    {
      from: "Ado-Ekiti",
      to: "Ikole-Ekiti",
      price: "₦1,500",
    },
  ];

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Popular Routes
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Discover popular destinations and routes across Ekiti State.
          </p>
        </div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {routes.map((route, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >

              {/* Route Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-green-600">
                  Popular Route
                </span>

                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  Ekiti
                </span>
              </div>

              {/* Starting Location */}
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  From
                </p>

                <h3 className="text-lg font-bold text-gray-900">
                  {route.from}
                </h3>
              </div>

              {/* Route Line */}
              <div className="flex items-center gap-3 my-4">
                <div className="h-2 w-2 rounded-full bg-green-600"></div>

                <div className="flex-1 border-t border-dashed border-gray-300"></div>

                <span className="text-green-600 text-lg">
                  →
                </span>

                <div className="flex-1 border-t border-dashed border-gray-300"></div>

                <div className="h-2 w-2 rounded-full bg-green-600"></div>
              </div>

              {/* Destination */}
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  To
                </p>

                <h3 className="text-lg font-bold text-gray-900">
                  {route.to}
                </h3>
              </div>

              {/* Fare + Button */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-end justify-between">

                <div>
                  <p className="text-xs text-gray-500">
                    Estimated fare
                  </p>

                  <p className="text-xl font-bold text-green-600">
                    {route.price}
                  </p>
                </div>

                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                  View Route
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* View All Routes */}
        <div className="text-center mt-10">
          <button className="border border-green-600 text-green-600 px-7 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition">
            View All Routes
          </button>
        </div>

      </div>
    </section>
  );
}

export default PopularRoutes;