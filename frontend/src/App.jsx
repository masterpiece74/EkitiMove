
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import RoutesPage from "./pages/Routes";
import About from "./pages/About";

import PassengerDashboard from "./pages/dashboard/PassengerDashboard";
import PassengerProfile from "./pages/profile/PassengerProfile";

import RequestTrip from "./pages/trips/RequestTrip";
import MyTrips from "./pages/trips/MyTrips";
import TripDetails from "./pages/trips/TripDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/routes" element={<RoutesPage />} />

        <Route path="/about" element={<About />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={<PassengerDashboard />}
        />

        <Route
          path="/request-trip"
          element={<RequestTrip />}
        />

        <Route
          path="/trips"
          element={<MyTrips />}
        />

        <Route
          path="/trip-details/:tripId"
          element={<TripDetails />}
        />

        <Route
          path="/profile"
          element={<PassengerProfile />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
