import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import Upload from './components/Upload';
import View from './components/View';
import Login from './components/Login';       
import Register from './components/Register'; 
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  // Define Logout function first so we can use it inside useEffect
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  // Verify Token on App Load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');

    if (storedToken) {
      // Set initial state from cache
      setToken(storedToken);
      setUsername(storedUser);

      // Verify with Backend if this token is actually still valid
      axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(res => {
        // Token is valid!
        console.log("Session verified for:", res.data.user.username);
      })
      .catch((err) => {
        // Token is invalid or expired
        console.warn("Session expired or invalid. Logging out...");
        handleLogout();
      });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        
        {/* Navigation Bar */}
        <nav className="bg-white shadow mb-8">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              LinkVolt ⚡
            </Link>
            
            <div className="flex items-center space-x-6">
              {token ? (
                <>
                  <span className="text-gray-500 text-sm hidden sm:inline">
                    Hello, <b>{username}</b>
                  </span>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                    My Dashboard
                  </Link>
                  <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
                    Upload
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="text-red-500 hover:text-red-700 font-medium border border-red-100 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex justify-center p-4">
          <div className="w-full max-w-md">
            <Routes>
              {/* Protected Route: Home/Upload */}
              <Route 
                path="/" 
                element={token ? <Upload token={token} /> : <Navigate to="/login" />} 
              />
              
              {/* Login Page */}
              <Route 
                path="/login" 
                element={!token ? <Login setToken={setToken} setUsername={setUsername} /> : <Navigate to="/" />} 
              />
              
              {/* Register Page */}
              <Route 
                path="/register" 
                element={!token ? <Register /> : <Navigate to="/" />} 
              />
              
              {/* Protected Route: Dashboard */}
              <Route 
                path="/dashboard" 
                element={token ? <Dashboard /> : <Navigate to="/login" />} 
              />
              
              {/* Public Route: View Shared Link */}
              <Route path="/:id" element={<View />} />
            </Routes>
          </div>
        </div>
        
      </div>
    </Router>
  );
}

export default App;