import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAlertStore } from "../stores/alertStore";
import toast from "react-hot-toast";

// Sample thermal data structure that would come from the AMG8833
export interface ThermalData {
  grid: number[][];
  averageTemp: number;
  maxTemp: number;
  minTemp: number;
  timestamp: number;
}

interface WebSocketContextType {
  isConnected: boolean;
  thermalData: ThermalData | null;
  environmentTemp: number;
  connect: () => void;
  disconnect: () => void;
  lastError: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [thermalData, setThermalData] = useState<ThermalData | null>(null);
  const [environmentTemp, setEnvironmentTemp] = useState(31.2);
  const [lastError, setLastError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { addAlert } = useAlertStore();
  const reconnectTimeoutRef = useRef<number>();
  // Track if error toasts have been shown this session
  const hasShownDisconnectedToast = useRef(false);
  const hasShownUnableToConnectToast = useRef(false);
  // Track which sectors have already shown a critical alert toast
  const shownCriticalToastSectors = useRef<Set<string>>(new Set());

  const connect = () => {
    try {
      // Clear any existing connection and error state
      if (wsRef.current) {
        wsRef.current.close();
      }
      setLastError(null);

      // Get WebSocket URL from environment variables
      const wsUrl = import.meta.env.VITE_WS_URL;
      console.log("Attempting to connect to:", wsUrl);

      if (!wsUrl) {
        const error = "WebSocket URL not configured in environment variables";
        console.error(error);
        toast.error(error);
        setLastError(error);
        return;
      }

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established");
        setIsConnected(true);
        setLastError(null);
        toast.success("Connected to thermal sensor");
        // Clear any reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        setIsConnected(false);
        const error = `Disconnected from thermal sensor (Code: ${event.code})`;
        setLastError(error);
        if (!hasShownDisconnectedToast.current) {
          toast.error(error);
          hasShownDisconnectedToast.current = true;
        }
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = window.setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        const errorMessage =
          "Unable to connect to thermal sensor. Please check if the device is online and you are connected to the ESP32 WiFi network.";
        setLastError(errorMessage);
        if (!hasShownUnableToConnectToast.current) {
          toast.error(errorMessage);
          hasShownUnableToConnectToast.current = true;
        }
        setIsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          console.log("Received WebSocket message:", event.data);
          const data = JSON.parse(event.data);

          // Validate the data structure
          if (data.grid && Array.isArray(data.grid) && data.grid.length === 8) {
            setThermalData(data);
            setEnvironmentTemp(data.environmentTemp || environmentTemp);

            // Check for temperature alerts
            if (data.maxTemp > 40) {
              const hotSpot = findHotSpot(data.grid);
              addAlert({
                type: "critical",
                message: `High temperature detected in sector ${hotSpot}`,
                sectorId: hotSpot,
                value: data.maxTemp,
              });

              // Only show the toast if we haven't shown it for this sector yet
              if (!shownCriticalToastSectors.current.has(hotSpot)) {
                toast.error(
                  `Critical Alert: High temperature in sector ${hotSpot}`
                );
                shownCriticalToastSectors.current.add(hotSpot);
              }
            } else if (data.maxTemp > 37) {
              const hotSpot = findHotSpot(data.grid);
              addAlert({
                type: "warning",
                message: `Temperature rising in sector ${hotSpot}`,
                sectorId: hotSpot,
                value: data.maxTemp,
              });
            }
          } else {
            console.warn("Invalid data format received:", data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setLastError("Error parsing data from sensor");
        }
      };
    } catch (error) {
      const errorMessage = `WebSocket connection failed: ${error}`;
      console.error(errorMessage);
      setLastError(errorMessage);
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = window.setTimeout(connect, 5000);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setIsConnected(false);
    setLastError(null);
  };

  // Helper function to find the hottest spot in the grid
  const findHotSpot = (grid: number[][]): string => {
    let maxTemp = -Infinity;
    let maxRow = 0;
    let maxCol = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] > maxTemp) {
          maxTemp = grid[i][j];
          maxRow = i;
          maxCol = j;
        }
      }
    }

    return `${String.fromCharCode(65 + maxRow)}${maxCol + 1}`;
  };

  // Connect on component mount
  useEffect(() => {
    console.log("WebSocketProvider mounted, attempting to connect...");
    connect();

    // Cleanup on unmount
    return () => {
      console.log("WebSocketProvider unmounting, cleaning up...");
      disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        thermalData,
        environmentTemp,
        connect,
        disconnect,
        lastError,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }

  return context;
};

export default WebSocketProvider;
