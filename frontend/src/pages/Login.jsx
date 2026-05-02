import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl mb-6 font-extrabold text-gray-800 text-center">Welcome Back</h2>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">{error}</div>}

        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-bold text-lg">
          Log In
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline font-medium">Sign up</Link>
        </p>
      </form>
    </div>
  );
}