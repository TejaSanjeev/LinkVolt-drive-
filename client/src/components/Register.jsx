import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New State
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 1. Validate Length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // 2. Validate Match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            placeholder="Choose a Username"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Min 6 characters"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;