import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken, setUsername }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        username: usernameInput, 
        password 
      });

      if (res.data.success) {
        // 1. Save to Local Storage (Persist session)
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);

        // 2. Update App State (Update UI immediately)
        setToken(res.data.token);
        setUsername(res.data.username);

        // 3. Redirect to Home (Upload Page)
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to LinkVolt</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline font-medium">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;