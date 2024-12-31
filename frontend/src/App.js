import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Users from './pages/users.js';
import Goals from './pages/goals.js';
import Calendar from './pages/calendar.js';

function App() {
  return (
    <Router>
      <div className="gb-blue-500 text-black p-4">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<div className="text-center"><h1 className="text-4xl font-bold mb-4">Tervetuloa!</h1><p className="text-lg">Valitse sivu ylhäältä.</p></div>} />
              <Route path="/users" element={<Calendar />} />
              <Route path="/goals" element={<Users />} />
              <Route path="/" element={<Goals />} />
            </Routes>
          </div>
        </div>
      </Router>

  );
}

export default App;
