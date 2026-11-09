
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api";

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusStyle(status) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Accepted":
      return "bg-blue-100 text-blue-700";
    case "In Progress":
      return "bg-purple-100 text-purple-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function MyTrips() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrips = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/trips/passenger/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load your trips.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected trips response.");
      }

      setTrips(data);
    } catch (fetchError) {
      console.error("Fetch trips error:", fetchError);
      setError("Unable to load your trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      if (!parsedUser.id) {
        throw new Error("Passenger ID is missing.");
      }

      setUser(parsedUser);
      fetchTrips(parsedUser.id);
    } catch (parseError) {
      console.error("Invalid user data:", parseError);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-green-700"
          >
            EkitiMove
          </Link>

          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-green-700 font-semibold"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Trips
            </h1>

            <p className="text-gray-600 mt-2">
              Manage and track your transport requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchTrips(user.id)}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Refreshing..." : "↻ Refresh Trips"}
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-700 mb-3">{error}</p>

            <button
              type="button"
              onClick={() => fetchTrips(user.id)}
              className="text-red-700 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">🚌</div>

            <h2 className="text-xl font-bold text-gray-900">
              No trips yet
            </h2>

            <p className="text-gray-600 mt-2 mb-6">
              You haven't requested any trips yet.
            </p>

            <button
              type="button"
              onClick={() => navigate("/request-trip")}
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Request Your First Trip
            </button>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="space-y-5">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Trip #{trip.id}
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-2">
                      {trip.from_location || "Starting point"}
                      <span className="text-green-700 mx-2">→</span>
                      {trip.to_location || "Destination"}
                    </h2>
                  </div>

                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold w-fit ${getStatusStyle(
                      trip.status
                    )}`}
                  >
                    {trip.status || "Requested"}
                  </span>
                </div>

                <div className="border-t border-gray-100 my-5" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-gray-500">Transport</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      🚌 {trip.transport || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Pickup Point</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      📍 {trip.pickup_point || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Requested On</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {formatDate(trip.requested_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Trip Fare</p>
                    <p className="text-xl font-bold text-green-700 mt-1">
                      ₦{Number(trip.fare || 0).toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-5 pt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/trip-details/${trip.id}`)}
                    className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    View Trip Details →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </section>
  );
}

export default MyTrips;
