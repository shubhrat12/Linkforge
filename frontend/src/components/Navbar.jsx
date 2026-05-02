import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 shadow-lg p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold tracking-tight">Tier.ly</Link>
      
      {token ? (
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-md font-medium"
        >
          Logout
        </button>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
          <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md font-medium">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}