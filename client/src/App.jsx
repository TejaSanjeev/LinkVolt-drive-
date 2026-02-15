import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Upload from './components/Upload';
import View from './components/View';
import Login from './components/Login';       
import Register from './components/Register'; 
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    if (storedToken) {
      setToken(storedToken);
      setUsername(storedUser);
      axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).catch(() => handleLogout());
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen text-gray-100 selection:bg-blue-500 selection:text-white pb-20">
        
        {/* Glass Navbar - Full Width */}
        <nav className="glass-panel sticky top-0 z-50 border-b border-gray-700 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-80 transition">
              LinkVolt<span className="text-white">⚡</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {token ? (
                <>
                  <span className="text-gray-400 text-sm hidden sm:inline">
                    Welcome, <span className="text-blue-400 font-semibold">{username}</span>
                  </span>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/" className="text-gray-300 hover:text-white font-medium transition">
                    New Upload
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="text-red-400 hover:text-red-300 font-medium border border-red-900/50 bg-red-900/10 px-4 py-1.5 rounded-full transition hover:bg-red-900/30"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white font-medium transition">
                    Login
                  </Link>
                  <Link to="/register" className="btn-volt px-5 py-2 rounded-full text-white font-bold text-sm shadow-lg">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content Area - WIDE Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Routes>
              <Route path="/" element={token ? <Upload token={token} /> : <Navigate to="/login" />} />
              <Route path="/login" element={!token ? <Login setToken={setToken} setUsername={setUsername} /> : <Navigate to="/" />} />
              <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
              <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/:id" element={<View />} />
            </Routes>
        </div>
        
      </div>
    </Router>
  );
}

export default App;