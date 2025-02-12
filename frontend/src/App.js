import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Users from './pages/users.js';
import Goals from './pages/goals.js';
import Calendar from './pages/calendar.js';
import Login from './pages/login.js';
import Register from './pages/register.js';
import Dashboard from './pages/dashboard.js';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  //Protected route component
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <Routes>
              <Route path="/" 
              element={
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">Tervetuloa!</h1>
                  <p className="text-lg">Etusivu.</p>
                </div>} 
              />
              <Route path="/login" element={<Login setToken={setToken}  />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard token={token} /></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />

            </Routes>
          </div>
        </div>
      </Router>

  );
}

export default App;
