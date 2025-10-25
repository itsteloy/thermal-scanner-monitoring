import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Filter } from 'lucide-react';

// Mock historical data
const generateMockHistoryData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now.getTime() - i * 3600000 * (Math.random() * 5));
    
    data.push({
      id: i.toString(),
      eventType: ['Temperature Spike', 'System Alert', 'Device Status Change', 'User Action'][
        Math.floor(Math.random() * 4)
      ],
      message: [
        'High temperature detected in sector A3',
        'Temperature rising in sector B2',
        'Lighting system in auto-adjustment mode',
        'System restarted by admin',
        'Device connected successfully',
        'Device disconnected unexpectedly',
      ][Math.floor(Math.random() * 6)],
      severity: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)],
      timestamp,
      location: `Sector ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(
        Math.random() * 9
      )}`,
    });
  }
  
  return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const historyData = generateMockHistoryData();

const HistoryPage = () => {
  const [filter, setFilter] = useState('all');
  
  const filteredData = filter === 'all' 
    ? historyData 
    : historyData.filter(item => item.severity === filter);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-slate-400 mt-1">
          View and analyze historical events and alerts
        </p>
      </div>
      
      {/* Filter controls */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <Filter size={18} className="mr-2 text-slate-400" />
            <span className="mr-2">Filter by:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
            >
              <option value="all">All Events</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Information</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <Calendar size={18} className="mr-2 text-slate-400" />
            <span className="mr-2">Date Range:</span>
            <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm">
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* History table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700 text-slate-300">
              <tr>
                <th className="py-3 px-4 text-left">Timestamp</th>
                <th className="py-3 px-4 text-left">Event Type</th>
                <th className="py-3 px-4 text-left">Message</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-4 text-slate-300">
                    {format(item.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="py-3 px-4">{item.eventType}</td>
                  <td className="py-3 px-4">{item.message}</td>
                  <td className="py-3 px-4">{item.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.severity === 'critical'
                        ? 'bg-danger/20 text-danger'
                        : item.severity === 'warning'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-info/20 text-info'
                    }`}>
                      {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-700 flex justify-between items-center">
          <div className="text-sm text-slate-400">
            Showing <span className="text-white">{filteredData.length}</span> of{' '}
            <span className="text-white">{historyData.length}</span> events
          </div>
          <div className="flex">
            <button className="px-3 py-1 bg-slate-700 text-white rounded-l hover:bg-slate-600 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-r hover:bg-primary-dark transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;