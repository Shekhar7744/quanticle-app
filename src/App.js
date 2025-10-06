import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ContributePage from './pages/ContributePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ModerationDashboard from './pages/ModerationDashboard';
import SandboxLab from './pages/SandboxLab';
import SandboxGallery from './pages/SandboxGallery';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Simulation3D from './pages/Simulation3D';   // ✅ NEW (3D page)
import SimulationPlayer from './pages/SimulationPlayer';

import PrivateRoute from './components/PrivateRoute';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import logo from './assets/logo.png';

const App = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const isAdmin = user && user.email === 'shekharsinha952@gmail.com';

  return (
    <Router>
      <div className="bg-[#0b0c1e] min-h-screen text-white">
        {/* Navbar */}
        <nav className="bg-[#0e0f2b] shadow flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Quanticle Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-neonBlue">Quanticle</span>
          </div>
          <div className="space-x-4 flex items-center">
            <Link to="/" className="hover:text-neonPurple">Home</Link>
            <Link to="/explore" className="hover:text-neonPurple">Explore</Link>
            <Link to="/contribute" className="hover:text-neonPurple">Contribute</Link>
            <Link to="/sandbox" className="hover:text-neonPurple">Sandbox Lab</Link>
            <Link to="/gallery" className="hover:text-neonPurple">Gallery</Link>
            <Link to="/3d"      className="hover:text-neonPurple">3D Lab</Link> {/* ✅ NEW */}

            {user && <Link to="/profile" className="hover:text-neonPurple">Profile</Link>}

            {isAdmin && (
              <>
                <Link to="/moderation" className="hover:text-red-400">Moderation</Link>
                <Link to="/admin" className="hover:text-red-400">Admin</Link>
                <Link to="/analytics" className="hover:text-neonBlue">Analytics</Link>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" className="hover:text-neonPurple">Login</Link>
                <Link to="/signup" className="hover:text-neonPurple">Signup</Link>
              </>
            )}
            {user && (
              <button
                onClick={() => {
                  auth.signOut().then(() => (window.location.href = '/'));
                }}
                className="ml-4 text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/sandbox" element={<SandboxLab />} />
          <Route path="/gallery" element={<SandboxGallery />} />
          <Route path="/3d" element={<Simulation3D />} /> {/* ✅ NEW */}
          <Route path="/play/:id" element={<SimulationPlayer />} />
          <Route
            path="/contribute"
            element={
              <PrivateRoute>
                <ContributePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/moderation" element={<ModerationDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-4 bg-[#0e0f2b] border-t border-gray-800 mt-10">
        © {new Date().getFullYear()} Quanticle | Made with curiosity by Shekhar Sinha
      </footer>
    </Router>
  );
};

export default App;