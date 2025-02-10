import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Users from './pages/users.js';
import Goals from './pages/goals.js';
import Calendar from './pages/calendar.js';
import Login from './pages/login.js';
import Register from './pages/register.js';
import Dashboard from './pages/dashboard.js';

function App() {
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
                  <p className="text-lg">etusivu.</p>
                </div>} />
              <Route path="/login" element={<Login setToken={setToken}  />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/users" element={<Users />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </div>
        </div>
      </Router>

  );
}

export default App;
