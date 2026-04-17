import { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

const API = "http://localhost:5000/api/v1";

function App() {
  const [view, setView] = useState("loading"); // loading, auth, dashboard, profile

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API}/user/me`, { withCredentials: true });
        setView("dashboard");
      } catch (err) {
        setView("auth");
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => setView("dashboard");
  const handleLogout = () => setView("auth");
  const goToProfile = () => setView("profile");
  const goToDashboard = () => setView("dashboard");

  if (view === "loading") {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {view === "auth" && <Auth onLogin={handleLogin} />}
      {view === "dashboard" && <Dashboard onLogout={handleLogout} onProfile={goToProfile} />}
      {view === "profile" && <Profile onBack={goToDashboard} />}
    </div>
  );
}

export default App;
