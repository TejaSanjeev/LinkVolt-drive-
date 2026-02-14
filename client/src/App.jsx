import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import Upload from './components/Upload';
import View from './components/View';
import Login from './components/Login';       
import Register from './components/Register'; 
import Dashboard from './components/Dashboard';

function App() {
  // 1. Initialize state from LocalStorage (Cache)
  // This ensures the user stays logged in even if they refresh the page.
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  // 2. Sync state if localStorage changes (Optional safety check)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    if (storedToken) {
        setToken(storedToken);
        setUsername(storedUser);
    }
  }, []);

  // 3. Logout Function
  const handleLogout = () => {
    // Clear the cache
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Clear State
    setToken(null);
    setUsername(null);
    
    // Redirect happens automatically because of the Route logic below
  };

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
                  {/* User is Logged In */}
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
                  {/* User is Guest */}
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
              {/* Strict Protection:
                 If 'token' exists -> Show Upload Page
                 If NO 'token' -> Redirect to Login 
              */}
              <Route 
                path="/" 
                element={token ? <Upload token={token} /> : <Navigate to="/login" />} 
              />
              
              {/* Login Page: If already logged in, go to Home */}
              <Route 
                path="/login" 
                element={!token ? <Login setToken={setToken} setUsername={setUsername} /> : <Navigate to="/" />} 
              />
              
              {/* Register Page: If already logged in, go to Home */}
              <Route 
                path="/register" 
                element={!token ? <Register /> : <Navigate to="/" />} 
              />
              
              {/* Dashboard: Protected */}
              <Route 
                path="/dashboard" 
                element={token ? <Dashboard /> : <Navigate to="/login" />} 
              />

              {/* View Page: PUBLIC (Must remain accessible to everyone) */}
              <Route path="/:id" element={<View />} />
            </Routes>
          </div>
        </div>
        
      </div>
    </Router>
  );
}

export default App;