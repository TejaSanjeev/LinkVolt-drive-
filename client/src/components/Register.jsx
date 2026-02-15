import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

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
    <div className="glass-panel p-8 rounded-2xl shadow-2xl max-w-sm mx-auto mt-10 border border-gray-700/50 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Join LinkVolt
        </h2>
        <p className="text-gray-400 text-sm mt-2">Create your secure account</p>
      </div>

      {error && (
        <div className="bg-red-900/30 text-red-300 p-3 rounded mb-4 text-sm text-center border border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Username</label>
          <input
            type="text"
            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 input-glow transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Password</label>
          <input
            type="password"
            placeholder="Min 6 chars"
            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 input-glow transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500 input-glow transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full btn-volt py-3 rounded-xl text-white font-bold shadow-lg mt-2"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-gray-400 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;