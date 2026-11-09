
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../api";

function formatDate(date) {
  if (!date) return "Not yet available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
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

function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // HANDLE EXPIRED SESSION
  const handleSessionExpired = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // CHECK LOGGED-IN USER
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (!savedUser || !token) {
      handleSessionExpired();
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "Passenger" || !parsedUser.id) {
        navigate("/");
        return;
      }

      setUser(parsedUser);
    } catch (parseError) {
      console.error("Invalid user data:", parseError);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, [navigate]);

  // FETCH AUTHENTICATED PASSENGER TRIP DETAILS
  useEffect(() => {
    if (!user || !tripId) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      handleSessionExpired();
      return;
    }

    let cancelled = false;

    async function fetchTripDetails() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/trips/passenger/${user.id}/${tripId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          handleSessionExpired();
          return;
        }

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Trip not found."
              : "Unable to load trip details."
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setTrip(data);
        }
      } catch (fetchError) {
        console.error("Trip details error:", fetchError);

        if (!cancelled) {
          setError(fetchError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTripDetails();

    return () => {
      cancelled = true;
    };
  }, [user, tripId]);

  const progressSteps = [
    { label: "Trip Requested", date: trip?.requested_at },
    { label: "Trip Accepted", date: trip?.accepted_at },
    { label: "Driver Arrived", date: trip?.driver_arrived_at },
    { label: "Journey Started", date: trip?.started_at },
    { label: "Trip Completed", date: trip?.completed_at },
  ];

  const statusOrder = [
    "Requested",
    "Accepted",
    "Driver Arrived",
    "In Progress",
    "Completed",
  ];

  const currentStep = statusOrder.indexOf(trip?.status);

  if (!user) return null;

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
            to="/trips"
            className="text-gray-600 hover:text-green-700 font-semibold"
          >
            ← My Trips
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Trip #{tripId}</p>

          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Trip Details
          </h1>

          <p className="text-gray-600 mt-2">
            View your booking information and journey progress.
          </p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl p-10 text-center">
            Loading trip details...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-700">{error}</p>

            <button
              onClick={() => navigate("/trips")}
              className="mt-4 text-red-700 font-semibold underline"
            >
              Return to My Trips
            </button>
          </div>
        )}

        {!loading && !error && trip && (
          <div className="space-y-6">
            {/* Route summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <span className="text-sm text-gray-500">
                  Booking #{trip.id}
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                    trip.status
                  )}`}
                >
                  {trip.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <h2 className="text-xl font-bold mt-1">
                    {trip.from_location}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <h2 className="text-xl font-bold mt-1">
                    {trip.to_location}
                  </h2>
                </div>
              </div>
            </div>

            {/* Booking information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-5">
                Booking Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Transport</p>
                  <p className="font-semibold mt-1">
                    {trip.transport || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Pickup Point</p>
                  <p className="font-semibold mt-1">
                    {trip.pickup_point || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Pickup Address</p>
                  <p className="font-semibold mt-1">
                    {trip.pickup_address || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Trip Fare</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    ₦{Number(trip.fare || 0).toLocaleString("en-NG")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Requested On</p>
                  <p className="font-semibold mt-1">
                    {formatDate(trip.requested_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-5">
                Driver Information
              </h2>

              {trip.driver_name ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-gray-500">Driver Name</p>
                    <p className="font-semibold mt-1">
                      {trip.driver_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold mt-1">
                      {trip.driver_phone || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Driver Rating</p>
                    <p className="font-semibold mt-1">
                      {trip.driver_rating ?? "Not rated"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No driver has been assigned to this trip yet.
                </p>
              )}
            </div>

            {/* Vehicle information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-5">
                Vehicle Information
              </h2>

              {trip.vehicle_plate_number ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Registration Number
                    </p>
                    <p className="font-semibold mt-1">
                      {trip.vehicle_plate_number}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Vehicle Model</p>
                    <p className="font-semibold mt-1">
                      {trip.vehicle_model || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Vehicle Color</p>
                    <p className="font-semibold mt-1">
                      {trip.vehicle_color || "Not available"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  Vehicle information will appear when a vehicle is assigned.
                </p>
              )}
            </div>

            {/* Journey progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">
                Journey Progress
              </h2>

              {trip.status === "Cancelled" ? (
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="font-semibold text-red-700">
                    This trip has been cancelled.
                  </p>

                  <p className="text-sm text-red-600 mt-2">
                    {trip.cancellation_reason || "No cancellation reason provided."}
                  </p>

                  <p className="text-sm text-red-600 mt-2">
                    Cancelled on: {formatDate(trip.cancelled_at)}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {progressSteps.map((step, index) => {
                    const completed = Boolean(step.date);
                    const active =
                      !completed && currentStep === index;

                    return (
                      <div key={step.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              completed
                                ? "bg-green-600"
                                : active
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                          />

                          {index !== progressSteps.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200" />
                          )}
                        </div>

                        <div className="-mt-1">
                          <p className="font-semibold text-gray-900">
                            {step.label}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {completed
                              ? formatDate(step.date)
                              : active
                              ? "Current status"
                              : "Awaiting update"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-4">
              <Link
                to="/trips"
                className="text-green-700 font-semibold hover:underline"
              >
                ← Back to My Trips
              </Link>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Refresh Details
              </button>
            </div>
          </div>
        )}
      </main>
    </section>
  );
}

export default TripDetails;
