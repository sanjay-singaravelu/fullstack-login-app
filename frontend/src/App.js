import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status
  const [token, setToken] = useState(localStorage.getItem('token')); // Check for token

  // Function to set authentication status and token
  const handleAuth = (token) => {
    setToken(token);
    localStorage.setItem('token', token); // Store token in localStorage
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleAuth} />} />
        <Route
          path="/"
          element={isAuthenticated ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;