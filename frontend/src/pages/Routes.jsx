import { useState } from "react";

function RoutesPage() {
  const [routeType, setRouteType] = useState("inter-town");
  const [selectedTown, setSelectedTown] = useState("");

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-green-600 px-6 py-16 text-white">
        <div className="max-w-5xl mx-auto text-center">

          <h1 className="text-4xl md:text-5xl font-bold">
            Explore Ekiti Routes
          </h1>

          <p className="mt-4 text-green-50 text-lg max-w-2xl mx-auto">
            Find transportation routes between towns or discover
            destinations within towns across Ekiti State.
          </p>

        </div>
      </section>

      {/* Route Search */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

            {/* Route Type */}
            <div className="text-center">

              <h2 className="text-2xl font-bold text-gray-900">
                What type of journey?
              </h2>

              <p className="mt-2 text-gray-600">
                Choose how you want to travel.
              </p>

            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">

              <button
                onClick={() => setRouteType("inter-town")}
                className={`p-6 rounded-xl border-2 text-left transition ${
                  routeType === "inter-town"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-4xl mb-3">
                  
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Inter-Town
                </h3>

                <p className="mt-2 text-gray-600">
                  Travel from one town or city in Ekiti to another.
                </p>
              </button>

              <button
                onClick={() => setRouteType("within-town")}
                className={`p-6 rounded-xl border-2 text-left transition ${
                  routeType === "within-town"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-4xl mb-3">
                  
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Within-Town
                </h3>

                <p className="mt-2 text-gray-600">
                  Find places and routes within a town or city.
                </p>
              </button>

            </div>

            {/* Inter-Town Form */}
            {routeType === "inter-town" && (
              <div className="mt-10">

                <h3 className="text-xl font-bold text-gray-900">
                  Find an Inter-Town Route
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      From
                    </label>

                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">
                        Select starting town
                      </option>

                      <option>Ado-Ekiti</option>
                      <option>Ikere-Ekiti</option>
                      <option>Ikole-Ekiti</option>
                      <option>Ijero-Ekiti</option>
                      <option>Ifaki-Ekiti</option>
                      <option>Oye-Ekiti</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To
                    </label>

                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">
                        Select destination
                      </option>

                      <option>Ado-Ekiti</option>
                      <option>Ikere-Ekiti</option>
                      <option>Ikole-Ekiti</option>
                      <option>Ijero-Ekiti</option>
                      <option>Ifaki-Ekiti</option>
                      <option>Oye-Ekiti</option>
                    </select>
                  </div>

                </div>

              </div>
            )}

            {/* Within-Town Form */}
            {routeType === "within-town" && (
              <div className="mt-10">

                <h3 className="text-xl font-bold text-gray-900">
                  Find a Local Route
                </h3>

                <div className="mt-6">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Town
                  </label>

                  <select
                    value={selectedTown}
                    onChange={(e) => setSelectedTown(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">
                      Select a town
                    </option>

                    <option>Ado-Ekiti</option>
                    <option>Ikere-Ekiti</option>
                    <option>Ikole-Ekiti</option>
                    <option>Ijero-Ekiti</option>
                    <option>Ifaki-Ekiti</option>
                    <option>Oye-Ekiti</option>
                  </select>

                </div>

                {selectedTown && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        From
                      </label>

                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option>
                          Select starting location
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        To
                      </label>

                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option>
                          Select destination
                        </option>
                      </select>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Search Button */}
            <div className="text-center mt-8">

              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Find Route
              </button>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default RoutesPage;