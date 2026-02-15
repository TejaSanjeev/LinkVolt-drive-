import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken, setUsername }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username: usernameInput, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        setToken(res.data.token);
        setUsername(res.data.username);
        navigate('/'); 
      }
    } catch (err) { setError(err.response?.data?.error || 'Login failed.'); }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl shadow-2xl max-w-sm mx-auto mt-10 border border-gray-700/50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Welcome Back</h2>
        <p className="text-gray-400 text-sm mt-2">Enter your credentials to access the vault</p>
      </div>
      
      {error && <div className="bg-red-900/30 text-red-300 p-3 rounded mb-4 text-sm text-center border border-red-800">{error}</div>}
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Username</label>
            <input type="text" className="w-full bg-gray-900/50 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 transition" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} required />
        </div>
        <div>
            <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Password</label>
            <input type="password" className="w-full bg-gray-900/50 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-blue-500 transition" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full btn-volt py-3 rounded-xl text-white font-bold shadow-lg">Login</button>
      </form>
      <p className="mt-6 text-center text-gray-400 text-sm">New here? <a href="/register" className="text-blue-400 hover:text-blue-300 font-bold">Create Account</a></p>
    </div>
  );
};
export default Login;