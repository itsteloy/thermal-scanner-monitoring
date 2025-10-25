import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useAlertStore } from "../../stores/alertStore";

const TopBar = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { unreadCount, alerts, markAllAsRead } = useAlertStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd toggle a class on the root element or use a context
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-white">
        Chick Thermal Monitoring System
      </h1>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-slate-700 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 shadow-lg rounded-md border border-slate-700 z-50">
              <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">
                    No notifications
                  </div>
                ) : (
                  alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 border-b border-slate-700 ${
                        !alert.isRead ? "bg-slate-700/30" : ""
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`
                          w-2 h-2 mt-1.5 mr-2 rounded-full flex-shrink-0
                          ${
                            alert.type === "critical"
                              ? "bg-danger"
                              : alert.type === "warning"
                              ? "bg-warning"
                              : "bg-info"
                          }
                        `}
                        />
                        <div>
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-slate-700 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/alerts");
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="p-2 rounded-full hover:bg-slate-700"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className="p-2 rounded-full hover:bg-slate-700 text-danger-light"
          onClick={handleLogout}
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
