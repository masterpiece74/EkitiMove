
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api";

function RequestTrip() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);

  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    transport: "",
    pickup_point_id: "",
    fare_period_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [pickupLoading, setPickupLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // CHECK LOGGED-IN USER
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "Passenger") {
        navigate("/");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // GET LOCATIONS
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/locations`
        );

        if (!response.ok) {
          throw new Error("Failed to load locations.");
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

  // HANDLE FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSuccess("");
    setError("");

    if (name === "from_location" || name === "to_location") {
      setForm((previous) => ({
        ...previous,
        [name]: value,
        transport: "",
        pickup_point_id: "",
        fare_period_id: "",
      }));

      setRoutes([]);
      setPickupPoints([]);
      return;
    }

    if (name === "transport") {
      setForm((previous) => ({
        ...previous,
        transport: value,
        pickup_point_id: "",
        fare_period_id: "",
      }));

      setPickupPoints([]);
      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // GET ROUTES
  useEffect(() => {
    if (!form.from_location || !form.to_location) {
      setRoutes([]);
      return;
    }

    let active = true;

    const fetchRoutes = async () => {
      setRoutesLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          from_location: form.from_location,
          to_location: form.to_location,
        });

        const response = await fetch(
          `${API_BASE_URL}/routes?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to load routes.");
        }

        const data = await response.json();

        if (!active) return;

        setRoutes(data);

        if (data.length === 0) {
          setError(
            "No route is currently available for this journey."
          );
        }
      } catch (error) {
        if (!active) return;

        console.error(error);
        setRoutes([]);
        setError("Unable to find routes for this journey.");
      } finally {
        if (active) {
          setRoutesLoading(false);
        }
      }
    };

    fetchRoutes();

    return () => {
      active = false;
    };
  }, [form.from_location, form.to_location]);

  // GET SELECTED ROUTE
  const selectedRoute = routes.find(
    (route) => route.transport === form.transport
  );

  // GET PICKUP POINTS
  useEffect(() => {
    if (!selectedRoute) {
      setPickupPoints([]);
      setPickupLoading(false);
      return;
    }

    let active = true;

    const fetchPickupPoints = async () => {
      setPickupLoading(true);
      setPickupPoints([]);

      try {
        const response = await fetch(
          `${API_BASE_URL}/routes/${selectedRoute.id}/pickup-points`
        );

        if (!response.ok) {
          throw new Error("Failed to load pickup points.");
        }

        const data = await response.json();

        if (!active) return;

        setPickupPoints(data);

        // Automatically select the primary pickup point.
        const primaryPoint = data.find(
          (point) => point.is_primary === true
        );

        setForm((previous) => ({
          ...previous,
          pickup_point_id: primaryPoint
            ? String(primaryPoint.id)
            : "",
        }));

        if (data.length === 0) {
          setError("No pickup points are available for this route.");
        }
      } catch (error) {
        if (!active) return;

        console.error(error);
        setPickupPoints([]);
        setError("Unable to load pickup points.");
      } finally {
        if (active) {
          setPickupLoading(false);
        }
      }
    };

    fetchPickupPoints();

    return () => {
      active = false;
    };
  }, [selectedRoute?.id]);

  // GET SELECTED FARE
  const selectedFare = routes.find(
    (route) =>
      route.transport === form.transport &&
      route.fare_period ===
        ({
          1: "Morning",
          2: "Afternoon",
          3: "Evening",
          4: "Night",
        }[form.fare_period_id])
  );

  // REQUEST TRIP
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in to request a trip.");
      return;
    }

    if (
      !form.from_location ||
      !form.to_location ||
      !form.transport ||
      !form.pickup_point_id ||
      !form.fare_period_id
    ) {
      setError("Please complete all the trip details.");
      return;
    }

    if (!selectedRoute) {
      setError(
        "The selected transport is not available for this route."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/trips/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            route_id: selectedRoute.id,
            pickup_point_id: Number(form.pickup_point_id),
            fare_period_id: Number(form.fare_period_id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Trip request failed.");
      }

      setSuccess(
        `Trip requested successfully! Trip #${data.trip.id}`
      );

      setForm({
        from_location: "",
        to_location: "",
        transport: "",
        pickup_point_id: "",
        fare_period_id: "",
      });

      setRoutes([]);
      setPickupPoints([]);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // WAIT FOR USER
  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/dashboard"
            className="text-2xl font-bold text-green-600"
          >
            EkitiMove
          </Link>

          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-green-600 font-semibold"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Request a Trip
          </h1>

          <p className="text-gray-600 mt-2">
            Choose your destination and transportation details.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

          <form onSubmit={handleSubmit}>

            {/* From */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From
              </label>

              <select
                name="from_location"
                value={form.from_location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">
                  Select starting location
                </option>

                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* To */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To
              </label>

              <select
                name="to_location"
                value={form.to_location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">
                  Select destination
                </option>

                {locations
                  .filter(
                    (location) =>
                      location.name !== form.from_location
                  )
                  .map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Route Loading */}
            {routesLoading && (
              <p className="text-sm text-gray-500 mb-5">
                Finding available routes...
              </p>
            )}

            {/* Transport */}
            {routes.length > 0 && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transport Type
                </label>

                <select
                  name="transport"
                  value={form.transport}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select transport</option>

                  {[...new Set(
                    routes.map((route) => route.transport)
                  )].map((transport) => (
                    <option key={transport} value={transport}>
                      {transport}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pickup Point */}
            {form.transport && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Point
                </label>

                {pickupLoading ? (
                  <p className="text-sm text-gray-500">
                    Loading pickup points...
                  </p>
                ) : (
                  <>
                    <select
                      name="pickup_point_id"
                      value={form.pickup_point_id}
                      onChange={handleChange}
                      disabled={pickupPoints.length === 0}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    >
                      <option value="">
                        Select pickup point
                      </option>

                      {pickupPoints.map((point) => (
                        <option key={point.id} value={point.id}>
                          {point.name}
                          {point.is_primary
                            ? " (Primary)"
                            : " (Alternative)"}
                        </option>
                      ))}
                    </select>

                    {pickupPoints.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Terminal Park is the default pickup point.
                        You can select another available pickup point.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Fare Period */}
            {form.transport && (
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Travel Period
                </label>

                <select
                  name="fare_period_id"
                  value={form.fare_period_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select travel period</option>
                  <option value="1">Morning</option>
                  <option value="2">Afternoon</option>
                  <option value="3">Evening</option>
                  <option value="4">Night</option>
                </select>
              </div>
            )}

            {/* Selected Fare */}
            {form.transport && form.fare_period_id && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  Estimated Fare
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {selectedFare
                    ? `₦${Number(
                        selectedFare.fare
                      ).toLocaleString("en-NG")}`
                    : "Fare unavailable"}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 p-4 rounded-xl bg-green-50 text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || pickupLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Requesting Trip..." : "Request Trip"}
            </button>

          </form>

        </div>

      </main>

    </section>
  );
}

export default RequestTrip;
