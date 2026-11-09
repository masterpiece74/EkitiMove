import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function PassengerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      // Only passengers can access this dashboard
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-bold text-green-600"
          >
            EkitiMove
          </Link>

          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:text-red-700"
          >
            Logout
          </button>

        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.full_name} 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Where would you like to go today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Request Trip */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="text-3xl mb-4">
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Request a Trip
            </h2>

            <p className="text-gray-600 mt-2 mb-5">
              Find transportation and request a trip to your destination.
            </p>

            <button
              onClick={() => navigate("/request-trip")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Request Trip
            </button>

          </div>

          {/* My Trips */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="text-3xl mb-4">
              
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              My Trips
            </h2>

            <p className="text-gray-600 mt-2 mb-5">
              View your previous and active trips.
            </p>

            <button
              onClick={() => navigate("/trips")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition"
            >
              View Trips
            </button>

          </div>

          {/* Profile */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="text-3xl mb-4">
              👤
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              My Profile
            </h2>

            <p className="text-gray-600 mt-2 mb-5">
              View and manage your passenger account.
            </p>

            <button
              onClick={() => navigate("/profile")}
              className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-xl font-semibold transition"
            >
              View Profile
            </button>

          </div>

        </div>

        {/* Account Information */}
        <div className="mt-10 bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Account Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Full Name */}
            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                {user.full_name}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                {user.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                {user.phone}
              </p>
            </div>

          </div>

        </div>

      </main>

    </section>
  );
}

export default PassengerDashboard;

