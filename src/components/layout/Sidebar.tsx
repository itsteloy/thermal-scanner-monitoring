import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { 
  LayoutDashboard, 
  Thermometer, 
  BarChart2, 
  Bell, 
  History, 
  Lightbulb, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/temperature', icon: <Thermometer size={20} />, label: 'Temperature' },
    { to: '/analytics', icon: <BarChart2 size={20} />, label: 'Analytics' },
    { to: '/alerts', icon: <Bell size={20} />, label: 'Alerts' },
    { to: '/history', icon: <History size={20} />, label: 'History' },
    { to: '/lighting', icon: <Lightbulb size={20} />, label: 'Lighting' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div 
      className={`bg-slate-800 text-white transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      } border-r border-slate-700`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">ThermalScan</h1>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded-full hover:bg-slate-700 transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm transition-colors ${
                    isActive 
                      ? 'bg-primary-dark text-white' 
                      : 'text-slate-300 hover:bg-slate-700'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
            {user?.name.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;