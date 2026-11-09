
import { useEffect, useState } from "react";
import API_BASE_URL from "../api";

function SearchLocation() {
  const [locations, setLocations] = useState([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [transport, setTransport] = useState("Bus");

  const [routes, setRoutes] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingPickups, setLoadingPickups] = useState(false);
  const [error, setError] = useState("");

  // LOAD LOCATIONS
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/locations`);

        if (!response.ok) {
          throw new Error("Failed to load locations");
        }

        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load locations.");
      }
    };

    fetchLocations();
  }, []);

  // SWAP LOCATIONS
  const handleSwap = () => {
    const currentFrom = fromLocation;

    setFromLocation(toLocation);
    setToLocation(currentFrom);

    setRoutes([]);
    setPickupPoints([]);
    setSelectedPickup("");
  };

  // SEARCH ROUTES
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!fromLocation || !toLocation) {
      setError("Please select both your starting point and destination.");
      return;
    }

    if (fromLocation === toLocation) {
      setError("Starting point and destination cannot be the same.");
      return;
    }

    setLoading(true);
    setError("");
    setRoutes([]);
    setPickupPoints([]);
    setSelectedPickup("");

    try {
      const url =
        `${API_BASE_URL}/routes` +
        `?from_location=${encodeURIComponent(fromLocation)}` +
        `&to_location=${encodeURIComponent(toLocation)}` +
        `&transport=${encodeURIComponent(transport)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to search routes");
      }

      const data = await response.json();

      setRoutes(data);

      if (data.length === 0) {
        setError("No route found for the selected locations and transport.");
      } else {
        await fetchPickupPoints(data[0].id);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to search for routes.");
    } finally {
      setLoading(false);
    }
  };

  // LOAD PICKUP POINTS
  const fetchPickupPoints = async (routeId) => {
    setLoadingPickups(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/routes/${routeId}/pickup-points`
      );

      if (!response.ok) {
        throw new Error("Failed to load pickup points");
      }

      const data = await response.json();

      setPickupPoints(data);

      // Automatically select primary pickup point
      const primaryPickup = data.find(
        (pickup) => pickup.is_primary
      );

      if (primaryPickup) {
        setSelectedPickup(String(primaryPickup.id));
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load pickup points.");
    } finally {
      setLoadingPickups(false);
    }
  };

  return (
    <section className="px-6 py-14 bg-white">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Find Your Route
          </h2>

          <p className="mt-2 text-gray-600">
            Choose your starting point, destination and transport.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From
              </label>

              <select
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select starting location</option>

                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="h-12 w-12 mx-auto rounded-full border border-gray-300 bg-white text-green-600 hover:bg-green-50 transition"
              title="Swap locations"
            >
              ⇄
            </button>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To
              </label>

              <select
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select destination</option>

                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transport
            </label>

            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Bus">Bus</option>
              <option value="Keke">Keke</option>
              <option value="Taxi">Taxi</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
            </select>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-600 font-medium">
              {error}
            </p>
          )}

          <div className="text-center mt-7">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-10 py-3 rounded-xl font-semibold transition shadow-sm"
            >
              {loading ? "Searching..." : "Find Route"}
            </button>
          </div>
        </form>

        {routes.length > 0 && (
          <div className="mt-8">

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Available Route
            </h3>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Choose Pickup Point
              </label>

              {loadingPickups ? (
                <p className="text-gray-600">
                  Loading pickup points...
                </p>
              ) : pickupPoints.length > 0 ? (
                <select
                  value={selectedPickup}
                  onChange={(e) => setSelectedPickup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {pickupPoints.map((pickup) => (
                    <option key={pickup.id} value={pickup.id}>
                      {pickup.name}
                      {pickup.is_primary ? " — Main Pickup" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-600">
                  No pickup points available.
                </p>
              )}
            </div>

            {routes.map((route) => (
              <div
                key={`${route.id}-${route.fare_period}`}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {route.from} → {route.to}
                    </p>

                    <p className="text-gray-600 mt-1">
                      🚌 {route.transport}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {route.fare_period}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Fare</p>

                    <p className="text-2xl font-bold text-green-600">
                      ₦{route.fare.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center mt-6">
              <button
                type="button"
                disabled={!selectedPickup}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-10 py-3 rounded-xl font-semibold transition shadow-sm"
              >
                Continue
              </button>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}

export default SearchLocation;
