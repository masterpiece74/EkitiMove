
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../api";

function PassengerProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // CHECK LOGGED-IN USER AND TOKEN
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("access_token");

    if (!savedUser || !savedToken) {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
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
      setToken(savedToken);

    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, [navigate]);

  // HANDLE EXPIRED OR INVALID SESSION
  const handleSessionExpired = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // LOAD PROFILE
  useEffect(() => {
    if (!user || !token) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/profile/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          handleSessionExpired();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to load profile."
          );
        }

        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
        });

        const updatedUser = {
          ...user,
          full_name: data.full_name,
          phone: data.phone,
          email: data.email,
          role: data.role,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);

      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id, token]);

  // HANDLE FORM CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // SAVE PROFILE
  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update profile."
        );
      }

      const updatedUser = {
        ...user,
        full_name: data.profile.full_name,
        phone: data.profile.phone,
        email: data.profile.email,
        role: data.profile.role,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setSuccess("Profile updated successfully.");
      setEditing(false);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setForm({
      full_name: user.full_name || "",
      phone: user.phone || "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  // LOADING
  if (!user || loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-gray-600">
            Loading your profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/"
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
            My Profile
          </h1>

          <p className="text-gray-600 mt-2">
            View and manage your passenger account.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="bg-green-600 px-6 py-8 text-center">

            <div className="w-24 h-24 mx-auto rounded-full bg-white flex items-center justify-center text-4xl shadow-md">
              👤
            </div>

            <h2 className="text-2xl font-bold text-white mt-4">
              {user.full_name}
            </h2>

            <p className="text-green-100 mt-1">
              Passenger
            </p>

          </div>

          <div className="p-6 md:p-8">

            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 p-4 rounded-xl bg-green-50 text-green-700 text-sm">
                {success}
              </div>
            )}

            {!editing ? (

              <div className="space-y-6">

                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {user.full_name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email Address
                  </p>

                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone Number
                  </p>

                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {user.phone || "Not provided"}
                  </p>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                >
                  Edit Profile
                </button>

              </div>

            ) : (

              <form onSubmit={handleSave}>

                <div className="mb-5">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your full name"
                  />

                </div>

                <div className="mb-5">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-500"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed here.
                  </p>

                </div>

                <div className="mb-6">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your phone number"
                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-xl font-semibold transition"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            )}

          </div>

        </div>

      </main>

    </section>
  );
}

export default PassengerProfile;
