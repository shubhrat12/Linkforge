import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center mt-32 text-center">
      <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
        Go Home
      </Link>
    </div>
  );
}