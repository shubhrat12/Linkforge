import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/signup', { email, password });
      // If successful, log them in automatically
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl mb-6 font-extrabold text-gray-800 text-center">Create Account</h2>
        
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
          placeholder="Create Password" 
          required 
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 transition text-white p-3 rounded-lg font-bold text-lg">
          Sign Up
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
}