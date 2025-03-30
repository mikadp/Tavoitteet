import React, {useContext} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Users from './pages/users.js';
import Goals from './pages/goals.js';
import Calendar from './pages/calendar.js';
import Login from './pages/login.js';
import Register from './pages/register.js';
import Dashboard from './pages/dashboard.js';
import Home from "./pages/home.js";
import AuthContext from './context/AuthContext.js';

function App() {
  const { user, loading } = useContext(AuthContext);

  //Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return user ? children : <Navigate to="/" />;
  };

  const AdminRoute = ({ children, loading }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return user && user.role === "admin" ? children : <Navigate to="/" />;
  };

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
  );
}

export default App;
