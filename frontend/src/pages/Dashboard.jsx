import { useState, useEffect } from 'react';
import axios from '../api/axios';
import LinkCard from '../components/LinkCard';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await axios.get('/api/urls');
      setUrls(res.data);
    } catch (err) {
      console.error("Failed to fetch URLs");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/urls', { 
        longUrl: newUrl,
        customAlias: customAlias || undefined
      });
      setNewUrl('');
      setCustomAlias('');
      fetchUrls(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-4">Create New Link</h1>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
          <input 
            type="url" 
            required
            placeholder="Paste your long URL here..." 
            className="flex-grow p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Custom alias (optional)" 
            className="w-full md:w-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-4 rounded-lg font-bold">
            Shorten
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold text-gray-700 mb-4">Your Links</h2>
      {urls.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm">You haven't created any links yet.</p>
      ) : (
        <ul className="space-y-4">
          {urls.map(url => (
            <LinkCard key={url.id} url={url} />
          ))}
        </ul>
      )}
    </div>
  );
}