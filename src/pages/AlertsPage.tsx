import { useState } from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import {
  useAlertStore,
  formatAlertTime,
  AlertType,
  Alert, // Import Alert type
} from "../stores/alertStore";

const alertTypeStyles = {
  critical: {
    icon: <AlertCircle size={20} />,
    bg: "bg-danger/20",
    border: "border-danger",
    text: "text-danger",
    title: "Critical Alerts",
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    bg: "bg-warning/20",
    border: "border-warning",
    text: "text-warning",
    title: "Warnings",
  },
  notification: {
    icon: <Info size={20} />,
    bg: "bg-info/20",
    border: "border-info",
    text: "text-info",
    title: "Notifications",
  },
};

const AlertsPage = () => {
  const { alerts, markAsRead, markAllAsRead, clearAlerts } = useAlertStore();
  const [filter, setFilter] = useState<AlertType | "all">("all");

  const filteredAlerts =
    filter === "all" ? alerts : alerts.filter((alert) => alert.type === filter);

  const alertCounts = {
    critical: alerts.filter((a) => a.type === "critical" && !a.isRead).length,
    warning: alerts.filter((a) => a.type === "warning" && !a.isRead).length,
    notification: alerts.filter((a) => a.type === "notification" && !a.isRead)
      .length,
  };

  // Group by sectorId and type, keep only the latest alert for each
  const uniqueAlerts: Alert[] = Object.values(
    filteredAlerts.reduce<Record<string, Alert>>((acc, alert) => {
      // Use sectorId if available, otherwise extract from message
      const sectorMatch =
        alert.sectorId || alert.message.match(/sector (\w+)/i)?.[1] || "";
      const key = `${alert.type}-${sectorMatch}`;
      if (!acc[key] || acc[key].timestamp < alert.timestamp) {
        acc[key] = alert;
      }
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Alerts Center</h1>
        <p className="text-slate-400 mt-1">Monitor and manage system alerts</p>
      </div>

      {/* Alert Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className={`bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-pointer transition-all hover:border-danger ${
            filter === "critical" ? "ring-2 ring-danger" : ""
          }`}
          onClick={() => setFilter(filter === "critical" ? "all" : "critical")}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Critical Alerts</h2>
            <div className="text-danger">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-danger">
              {alertCounts.critical}
            </p>
            <p className="text-sm text-slate-400 mt-1">Active</p>
          </div>
        </div>

        <div
          className={`bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-pointer transition-all hover:border-warning ${
            filter === "warning" ? "ring-2 ring-warning" : ""
          }`}
          onClick={() => setFilter(filter === "warning" ? "all" : "warning")}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Warnings</h2>
            <div className="text-warning">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-warning">
              {alertCounts.warning}
            </p>
            <p className="text-sm text-slate-400 mt-1">Active</p>
          </div>
        </div>

        <div
          className={`bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-pointer transition-all hover:border-info ${
            filter === "notification" ? "ring-2 ring-info" : ""
          }`}
          onClick={() =>
            setFilter(filter === "notification" ? "all" : "notification")
          }
        >
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Notifications</h2>
            <div className="text-info">
              <Info size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-info">
              {alertCounts.notification}
            </p>
            <p className="text-sm text-slate-400 mt-1">Active</p>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Recent Alerts</h2>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Mark All as Read
            </button>
            <button
              onClick={clearAlerts}
              className="px-3 py-1 text-sm bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-700">
          {uniqueAlerts.length > 0 ? (
            uniqueAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 ${
                  !alert.isRead ? alertTypeStyles[alert.type].bg : ""
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex">
                    <div
                      className={`mt-1 mr-3 ${
                        alertTypeStyles[alert.type].text
                      }`}
                    >
                      {alertTypeStyles[alert.type].icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{alert.message}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {formatAlertTime(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.isRead && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button className="text-slate-400 hover:text-white">
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              {filter === "all"
                ? "No alerts found"
                : `No ${filter} alerts found`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
