import { useEffect, useState } from "react";
import { Thermometer, Activity, AlertTriangle, Sun } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import ThermalVisualization from "../components/thermal/ThermalVisualization";
import { useWebSocket } from "../context/WebSocketContext";
import { useAlertStore } from "../stores/alertStore";
import { formatAlertTime } from "../stores/alertStore";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const { thermalData, environmentTemp, isConnected, connect } = useWebSocket();
  const { alerts } = useAlertStore();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (thermalData) {
      setLastUpdated(new Date());
    }
  }, [thermalData]);

  // Mock data for demonstration
  const deviceStatus = {
    normal: 381,
    tooHot: 37,
    tooCold: 8,
    total: 426,
  };

  // Add handler for Refresh Data button
  const handleRefreshData = () => {
    connect();
    toast.success("Refreshing data...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Monitoring system status and key metrics
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <div className="text-sm text-slate-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-dark transition-colors"
            onClick={handleRefreshData}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Environment Temperature"
          value={environmentTemp}
          unit="°C"
          icon={<Thermometer size={24} className="text-white" />}
          color="bg-primary"
          change="+1.3%"
          isPositive={true}
        />
        <StatCard
          title="Avg. Sensor Temperature"
          value={thermalData?.averageTemp.toFixed(1) || "0"}
          unit="°C"
          icon={<Activity size={24} className="text-white" />}
          color="bg-info"
        />
        <StatCard
          title="Active Alerts"
          value={
            alerts.filter((a) => a.type === "critical" && !a.isRead).length
          }
          icon={<AlertTriangle size={24} className="text-white" />}
          color="bg-warning"
        />
        <StatCard
          title="Light Intensity"
          value="70"
          unit="%"
          icon={<Sun size={24} className="text-white" />}
          color="bg-warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thermal Visualization */}
        <div className="lg:col-span-1 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h2 className="text-lg font-medium mb-4">Thermal Visualization</h2>
          <div className="flex justify-center">
            <ThermalVisualization data={thermalData} />
          </div>
        </div>

        {/* Device Status */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h2 className="text-lg font-medium mb-4">Device Health Status</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {deviceStatus.normal}
              </div>
              <div className="text-sm text-slate-400">Normal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger">
                {deviceStatus.tooHot}
              </div>
              <div className="text-sm text-slate-400">Too Hot</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {deviceStatus.tooCold}
              </div>
              <div className="text-sm text-slate-400">Too Cold</div>
            </div>
          </div>

          {/* Status bar */}
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success via-warning to-danger"
              style={{ width: "100%" }}
            ></div>
          </div>

          <h3 className="text-md font-medium mt-6 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded text-sm transition-colors">
              Increase Heating
            </button>
            <button className="bg-info hover:bg-info-dark text-white py-2 px-4 rounded text-sm transition-colors">
              Adjust Lighting
            </button>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <h2 className="text-lg font-medium mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-md ${
                    alert.type === "critical"
                      ? "bg-danger/20 border-l-4 border-danger"
                      : alert.type === "warning"
                      ? "bg-warning/20 border-l-4 border-warning"
                      : "bg-info/20 border-l-4 border-info"
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      {alert.type === "critical" ? (
                        <AlertTriangle
                          size={16}
                          className="text-danger mr-2 mt-0.5"
                        />
                      ) : (
                        <AlertTriangle
                          size={16}
                          className="text-warning mr-2 mt-0.5"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          {alert.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatAlertTime(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-white">
                      <span className="sr-only">Dismiss</span>
                      &times;
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400">
                No active alerts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h2 className="text-lg font-medium mb-4">System Information</h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-md font-medium mb-2">Hardware Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-700 rounded-md flex items-center justify-between">
                <span className="text-sm">AMG8833 Thermal Camera</span>
                <span className="text-xs px-2 py-1 bg-success rounded text-white">
                  Online
                </span>
              </div>
              <div className="p-3 bg-slate-700 rounded-md flex items-center justify-between">
                <span className="text-sm">ESP32 Controller</span>
                <span className="text-xs px-2 py-1 bg-success rounded text-white">
                  Online
                </span>
              </div>
              <div className="p-3 bg-slate-700 rounded-md flex items-center justify-between">
                <span className="text-sm">WebSocket Connection</span>
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${
                    isConnected ? "bg-success" : "bg-danger"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
