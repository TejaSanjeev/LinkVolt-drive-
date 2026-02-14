import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Choose a Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Choose a Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
      </p>
    </div>
  );
};

export default Register;