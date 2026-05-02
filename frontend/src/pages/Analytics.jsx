import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import ClicksChart from '../components/ClicksChart';

export default function Analytics() {
  const { urlId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/api/analytics/${urlId}`);
        setStats(res.data);
      } catch (err) {
        setError('Failed to load analytics or unauthorized.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [urlId]);

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading analytics...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Link Analytics</h1>
        <Link to="/" className="text-blue-600 hover:underline font-medium">&larr; Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-gray-500 font-semibold mb-1">Total Clicks</p>
          <p className="text-5xl font-black text-blue-600">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-gray-500 font-semibold mb-1">Unique Visitors</p>
          <p className="text-5xl font-black text-green-600">{stats.unique}</p>
        </div>
      </div>

      {stats.devices && stats.devices.length > 0 ? (
        <ClicksChart data={stats.devices} />
      ) : (
        <p className="text-center text-gray-500 mt-10">No device data recorded yet. Share your link to get stats!</p>
      )}
    </div>
  );
}