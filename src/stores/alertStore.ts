import { create } from 'zustand';
import { format } from 'date-fns';

export type AlertType = 'critical' | 'warning' | 'notification';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: Date;
  isRead: boolean;
  sectorId?: string;
  value?: number;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAlerts: () => void;
}

// Mock data generation
const createMockAlerts = (): Alert[] => {
  return [
    {
      id: '1',
      type: 'critical',
      message: 'High temperature detected in sector A3',
      timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
      isRead: false,
      sectorId: 'A3',
    },
    {
      id: '2',
      type: 'warning',
      message: 'Temperature rising in sector B2',
      timestamp: new Date(Date.now() - 25 * 60000), // 25 minutes ago
      isRead: false,
      sectorId: 'B2',
    },
    {
      id: '3',
      type: 'warning',
      message: 'Lighting system in auto-adjustment mode',
      timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      isRead: false,
    },
  ];
};

export const useAlertStore = create<AlertState>()((set) => ({
  alerts: createMockAlerts(),
  unreadCount: 3,
  addAlert: (alertData) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      isRead: false,
      ...alertData,
    };
    
    set((state) => ({
      alerts: [newAlert, ...state.alerts],
      unreadCount: state.unreadCount + 1,
    }));
  },
  markAsRead: (id) => {
    set((state) => {
      const updatedAlerts = state.alerts.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      );
      
      const newUnreadCount = updatedAlerts.filter((alert) => !alert.isRead).length;
      
      return {
        alerts: updatedAlerts,
        unreadCount: newUnreadCount,
      };
    });
  },
  markAllAsRead: () => {
    set((state) => ({
      alerts: state.alerts.map((alert) => ({ ...alert, isRead: true })),
      unreadCount: 0,
    }));
  },
  clearAlerts: () => {
    set({
      alerts: [],
      unreadCount: 0,
    });
  },
}));

// Helper function to format alert time
export const formatAlertTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 24 * 60) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else {
    return format(date, 'MMM dd, h:mm a');
  }
};