import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LinkCard({ url }) {
  const [copied, setCopied] = useState(false);
  const shortLink = `http://localhost:3001/${url.short_code}`;

  const handleCopy = () => {
    // This secretly copies the REAL localhost link to their clipboard
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Change back to 'Copy' after 2 seconds
  };

  return (
    <li className="p-5 flex justify-between items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition mb-4">
      <div className="overflow-hidden flex-grow">
        <a 
          href={shortLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 font-bold text-xl hover:underline truncate block"
        >
          tier.ly/{url.short_code}
        </a>
        <p className="text-gray-500 text-sm truncate max-w-xl mt-1">
          {url.long_url}
        </p>
      </div>
      
      <div className="flex gap-2 ml-4 flex-shrink-0">
        <button 
          onClick={handleCopy}
          className={`text-sm font-medium px-4 py-2 rounded-md transition ${
            copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <Link 
          to={`/analytics/${url.id}`} 
          className="text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded-md transition"
        >
          View Stats
        </Link>
      </div>
    </li>
  );
}