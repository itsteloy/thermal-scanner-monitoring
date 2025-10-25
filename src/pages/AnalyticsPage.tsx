import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Clock, PieChart, Thermometer } from "lucide-react";
import StatCard from "../components/ui/StatCard";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  // Mock data for line chart
  const generateDummyData = () => ({
    temperature: Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 10) + 30
    ),
    humidity: Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 20) + 50
    ),
  });
  const dummy = generateDummyData();
  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: dummy.temperature,
        borderColor: "#FF6384", // Custom color
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Humidity (%)",
        data: dummy.humidity,
        borderColor: "#36A2EB", // Custom color
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Temperature (°C)" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "rgba(255, 255, 255, 0.7)" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: { display: true, text: "Humidity (%)" },
        grid: { drawOnChartArea: false },
        ticks: { color: "rgba(245, 158, 66, 0.7)" },
      },
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "rgba(255, 255, 255, 0.7)" },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        enabled: true,
        backgroundColor: "#22223b",
        titleColor: "#f2e9e4",
        bodyColor: "#c9ada7",
        borderColor: "#4a4e69",
        borderWidth: 2,
        callbacks: {
          label: function (context) {
            if (
              typeof context.dataset.label === "string" &&
              context.dataset.label.includes("Temp")
            ) {
              return `${context.dataset.label}: ${context.parsed.y}°C`;
            } else if (
              typeof context.dataset.label === "string" &&
              context.dataset.label.includes("Humidity")
            ) {
              return `${context.dataset.label}: ${context.parsed.y}%`;
            }
            return `${context.parsed.y}`;
          },
        },
      },
    },
  };

  // Mock data for bar chart
  const barChartData = {
    labels: ["0-1m", "1-2m", "2-3m", "3-4m", "4-5m", "5+m"],
    datasets: [
      {
        label: "Response Time",
        data: [7, 12, 10, 28, 6, 18],
        backgroundColor: "#10B981",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.8)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.7)",
        borderColor: "rgba(16, 185, 129, 0.5)",
        borderWidth: 1,
      },
    },
  };

  const temperature = 31.7; // from your data source
  const humidity = 58; // from your data source

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Comprehensive data analysis and insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Temperature & Humidity Card without Graph */}
        <StatCard
          title="Total Temperature & Humidity"
          value={`${temperature}°C / ${humidity}%`}
          icon={
            <span className="flex gap-1">
              <Thermometer size={20} className="text-white" />
            </span>
          }
          color="bg-info"
          change="-2.5% from last week"
          isPositive={false}
        />
        <StatCard
          title="Average Response Time"
          value="4.2m"
          icon={<Clock size={24} className="text-white" />}
          color="bg-info"
          change="+8.3% from last month"
          isPositive={true}
        />
        <StatCard
          title="Success Rate"
          value="98.5%"
          icon={<PieChart size={24} className="text-white" />}
          color="bg-success"
          change="+2.1% from last month"
          isPositive={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature and Humidity */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h2 className="text-lg font-medium mb-4">Temperature and Humidity</h2>
          <div style={{ height: "300px" }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h2 className="text-lg font-medium mb-4">
            Response Time Distribution
          </h2>
          <div style={{ height: "300px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Additional analytics sections could go here */}
    </div>
  );
};

export default AnalyticsPage;
