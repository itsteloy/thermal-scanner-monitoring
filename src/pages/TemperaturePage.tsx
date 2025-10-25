import { useEffect, useState } from 'react';
import ThermalVisualization from '../components/thermal/ThermalVisualization';
import { useWebSocket } from '../context/WebSocketContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TemperatureDataPoint {
  timestamp: Date;
  bodyTemp: number;
  envTemp: number;
}

// Create mock historical data
const generateHistoricalData = (): TemperatureDataPoint[] => {
  const data: TemperatureDataPoint[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3600000); // hourly data
    const bodyTemp = 36 + Math.random() * 5;
    const envTemp = 28 + Math.random() * 7;
    
    data.push({
      timestamp,
      bodyTemp,
      envTemp,
    });
  }
  
  return data;
};

const TemperaturePage = () => {
  const { thermalData, environmentTemp } = useWebSocket();
  const [historicalData, setHistoricalData] = useState<TemperatureDataPoint[]>([]);
  
  useEffect(() => {
    setHistoricalData(generateHistoricalData());
  }, []);
  
  // Add current data point when thermal data updates
  useEffect(() => {
    if (thermalData) {
      const newDataPoint: TemperatureDataPoint = {
        timestamp: new Date(),
        bodyTemp: thermalData.averageTemp,
        envTemp: environmentTemp,
      };
      
      setHistoricalData((prev) => [...prev.slice(1), newDataPoint]);
    }
  }, [thermalData, environmentTemp]);
  
  // Prepare chart data
  const chartData = {
    labels: historicalData.map((d) => {
      return d.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }),
    datasets: [
      {
        label: 'Body Temp',
        data: historicalData.map((d) => d.bodyTemp),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Env Temp',
        data: historicalData.map((d) => d.envTemp),
        borderColor: '#14B8A6',
        backgroundColor: 'rgba(20, 184, 166, 0.5)',
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 25,
        max: 45,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    },
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Temperature Monitoring</h1>
        <p className="text-slate-400 mt-1">
          Real-time temperature tracking and analysis
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thermal Visualization */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h2 className="text-lg font-medium mb-4">Thermal Visualization</h2>
          <div className="flex justify-center">
            <ThermalVisualization data={thermalData} size={400} />
          </div>
        </div>
        
        {/* Temperature History */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h2 className="text-lg font-medium mb-4">Temperature History</h2>
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      {/* Additional temperature stats could go here */}
    </div>
  );
};

export default TemperaturePage;