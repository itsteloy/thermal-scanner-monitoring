import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Network,
  Shield,
  Database,
  HelpCircle,
} from "lucide-react";
import { useAuthStore, UserRole } from "../stores/authStore";
import { useWebSocket } from "../context/WebSocketContext";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { user, users, createUser, removeUser } = useAuthStore();
  const { isConnected, connect, disconnect } = useWebSocket();
  const [activeTab, setActiveTab] = useState("account");
  const [tempThresholds, setTempThresholds] = useState({
    critical: 40,
    warning: 37,
    minimum: 25,
  });

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "OPERATION_MANAGER";

  // Tabs that are visible based on user role
  const availableTabs = [
    {
      id: "account",
      label: "Account",
      icon: <User size={18} />,
      visible: true,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      visible: true,
    },
    {
      id: "sensors",
      label: "Sensor Settings",
      icon: <Network size={18} />,
      visible: isAdmin || isManager,
    },
    {
      id: "security",
      label: "Security",
      icon: <Shield size={18} />,
      visible: isAdmin,
    },
    {
      id: "system",
      label: "System",
      icon: <Database size={18} />,
      visible: isAdmin,
    },
    {
      id: "user-management",
      label: "User Management",
      icon: <User size={18} />,
      visible: isAdmin,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle size={18} />,
      visible: true,
    },
  ].filter((tab) => tab.visible);

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">Account Settings</h2>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full bg-slate-700 border border-slate-600 rounded py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full bg-slate-700 border border-slate-600 rounded py-2 px-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role ? user.role.replace("_", " ") : ""}
                    disabled
                    className="w-full bg-slate-700 border border-slate-600 rounded py-2 px-3 text-white opacity-70"
                  />
                </div>

                <div className="pt-2">
                  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Receive system alerts via email
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
                      <div className="absolute left-1 top-1 bg-primary w-6 h-6 rounded-full transition-transform transform translate-x-6"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">SMS Alerts</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Receive critical alerts via SMS
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
                      <div className="absolute left-1 top-1 bg-primary w-6 h-6 rounded-full transition-transform transform translate-x-6"></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Browser Notifications</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Show alerts in browser
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        defaultChecked
                      />
                      <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
                      <div className="absolute left-1 top-1 bg-primary w-6 h-6 rounded-full transition-transform transform translate-x-6"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "sensors":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">Sensor Settings</h2>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Temperature Thresholds</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Critical Temperature (°C)
                  </label>
                  <input
                    type="range"
                    min="35"
                    max="45"
                    value={tempThresholds.critical}
                    onChange={(e) =>
                      setTempThresholds({
                        ...tempThresholds,
                        critical: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">35°C</span>
                    <span className="text-sm font-medium text-danger">
                      {tempThresholds.critical}°C
                    </span>
                    <span className="text-xs">45°C</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Warning Temperature (°C)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="40"
                    value={tempThresholds.warning}
                    onChange={(e) =>
                      setTempThresholds({
                        ...tempThresholds,
                        warning: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">30°C</span>
                    <span className="text-sm font-medium text-warning">
                      {tempThresholds.warning}°C
                    </span>
                    <span className="text-xs">40°C</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Minimum Temperature (°C)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="30"
                    value={tempThresholds.minimum}
                    onChange={(e) =>
                      setTempThresholds({
                        ...tempThresholds,
                        minimum: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs">20°C</span>
                    <span className="text-sm font-medium text-primary">
                      {tempThresholds.minimum}°C
                    </span>
                    <span className="text-xs">30°C</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                  Save Thresholds
                </button>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Sensor Configuration</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Reading Interval
                  </label>
                  <select className="w-full bg-slate-600 border border-slate-500 rounded py-2 px-3 text-white">
                    <option value="1">Every 1 second</option>
                    <option value="5" selected>
                      Every 5 seconds
                    </option>
                    <option value="10">Every 10 seconds</option>
                    <option value="30">Every 30 seconds</option>
                    <option value="60">Every minute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Calibration
                  </label>
                  <button className="px-3 py-1.5 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors text-sm">
                    Calibrate Sensors
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">
              Security Settings
            </h2>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Password</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-600 border border-slate-500 rounded py-2 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-600 border border-slate-500 rounded py-2 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-600 border border-slate-500 rounded py-2 px-3 text-white"
                  />
                </div>

                <div className="pt-2">
                  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Two-Factor Authentication</h3>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
                    <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">System Settings</h2>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">WebSocket Connection</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    ESP32 WebSocket URL
                  </label>
                  <input
                    type="text"
                    value={import.meta.env.VITE_WS_URL || "ws://192.168.4.1:81"}
                    className="w-full bg-slate-600 border border-slate-500 rounded py-2 px-3 text-white"
                    readOnly
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Make sure you are connected to the ESP32's WiFi network
                    (SSID: ESP32_Thermal)
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={isConnected ? disconnect : connect}
                    className={`px-4 py-2 ${
                      isConnected ? "bg-danger" : "bg-primary"
                    } text-white rounded hover:opacity-90 transition-colors`}
                  >
                    {isConnected ? "Disconnect" : "Connect"}
                  </button>
                  <button
                    onClick={() => {
                      if (isConnected) {
                        toast.success("WebSocket connection is active");
                      } else {
                        toast.error("WebSocket is not connected");
                      }
                    }}
                    className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
                  >
                    Test Connection
                  </button>
                </div>

                <div className="space-y-2">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded text-sm ${
                      isConnected
                        ? "bg-success/20 text-success"
                        : "bg-danger/20 text-danger"
                    }`}
                  >
                    Status: {isConnected ? "Connected" : "Disconnected"}
                  </div>

                  {!isConnected && (
                    <div className="text-sm text-slate-400">
                      <p className="font-medium mb-1">Troubleshooting steps:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>
                          Make sure the ESP32 is powered on and the LED is
                          blinking
                        </li>
                        <li>
                          Connect to the "ESP32_Thermal" WiFi network (password:
                          12345678)
                        </li>
                        <li>
                          Check that your computer has an IP address in the
                          192.168.4.x range
                        </li>
                        <li>
                          Try refreshing the page after connecting to the WiFi
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">System Maintenance</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Clear System Cache</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Remove temporary data to improve performance
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors text-sm">
                    Clear Cache
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Backup System Data</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Download a copy of all system data
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors text-sm">
                    Download Backup
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Reset to Factory Settings</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Reset all settings to default values
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-danger text-white rounded hover:bg-danger-dark transition-colors text-sm">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "user-management":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">User Management</h2>
            <UserCreationForm />
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-2">
                Existing Users
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-slate-700 rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-slate-300">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-slate-300">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-slate-300">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-600">
                        <td className="px-4 py-2 text-white">{u.name}</td>
                        <td className="px-4 py-2 text-white">{u.email}</td>
                        <td className="px-4 py-2 text-white">
                          {u.role.replace("_", " ")}
                        </td>
                        <td className="px-4 py-2">
                          {u.id !== user?.id && (
                            <button
                              className="px-3 py-1 bg-danger text-white rounded hover:bg-danger-dark transition-colors text-sm"
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to remove ${u.name}?`
                                  )
                                ) {
                                  try {
                                    removeUser(u.id);
                                    toast.success("User removed successfully");
                                  } catch (err: any) {
                                    toast.error(
                                      err.message || "Failed to remove user"
                                    );
                                  }
                                }
                              }}
                            >
                              Remove
                            </button>
                          )}
                          {u.id === user?.id && (
                            <span className="text-xs text-slate-400">
                              (You)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">Help & Support</h2>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Documentation</h3>

              <div className="space-y-3">
                <div className="flex items-center p-2 hover:bg-slate-600 rounded transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <HelpCircle size={16} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">User Manual</h4>
                    <p className="text-xs text-slate-400">
                      Complete guide to using the system
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-2 hover:bg-slate-600 rounded transition-colors">
                  <div className="w-8 h-8 rounded-full bg-info flex items-center justify-center">
                    <Settings size={16} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Device Setup Guide</h4>
                    <p className="text-xs text-slate-400">
                      How to set up and configure devices
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-2 hover:bg-slate-600 rounded transition-colors">
                  <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center">
                    <Bell size={16} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Alert Troubleshooting</h4>
                    <p className="text-xs text-slate-400">
                      Resolving common alert issues
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium mb-4">Contact Support</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Briefly describe your issue"
                    className="w-full bg-slate-600 border border-slate-500 rounded py-2 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about your issue..."
                    className="w-full bg-slate-600 border border-slate-500 rounded py-2 px-3 text-white"
                  ></textarea>
                </div>

                <div>
                  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your account and system preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings tabs sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center">
                <Settings size={18} className="text-primary mr-2" />
                <h2 className="font-medium">Settings</h2>
              </div>
            </div>

            <nav className="p-2">
              <ul className="space-y-1">
                {availableTabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 rounded text-sm ${
                        activeTab === tab.id
                          ? "bg-primary text-white"
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Settings content */}
        <div className="flex-1">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

function UserCreationForm() {
  const { createUser } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STAFF");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser({ name, email, password, role });
      toast.success("User created successfully");
      setName("");
      setEmail("");
      setPassword("");
      setRole("STAFF");
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-slate-700 rounded-lg p-4"
    >
      <h3 className="text-lg font-semibold text-white mb-2">Create New User</h3>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-slate-800 border border-slate-600 rounded py-2 px-3 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-slate-800 border border-slate-600 rounded py-2 px-3 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-slate-800 border border-slate-600 rounded py-2 px-3 text-white"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full bg-slate-800 border border-slate-600 rounded py-2 px-3 text-white"
        >
          <option value="ADMIN">Admin</option>
          <option value="OPERATION_MANAGER">Operation Manager</option>
          <option value="STAFF">Staff</option>
        </select>
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
