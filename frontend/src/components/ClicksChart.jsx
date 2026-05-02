import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ClicksChart({ data }) {
  return (
    <div className="h-80 w-full bg-white p-4 rounded-lg shadow border border-gray-100 mt-6">
      <h3 className="text-lg font-bold text-gray-700 mb-6">Device Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="device_type" />
          <YAxis allowDecimals={false} />
          <Tooltip cursor={{fill: '#f3f4f6'}} />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}