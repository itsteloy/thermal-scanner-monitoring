import { useEffect, useRef } from 'react';
import { ThermalData } from '../../context/WebSocketContext';

interface ThermalVisualizationProps {
  data: ThermalData | null;
  size?: number;
}

const ThermalVisualization = ({ data, size = 300 }: ThermalVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Define temperature ranges and colors
  const temperatureRanges = [
    { min: -Infinity, max: 25, color: '#3B82F6' }, // Cold (blue)
    { min: 25, max: 30, color: '#22D3EE' },        // Cool (cyan)
    { min: 30, max: 35, color: '#4ADE80' },        // Normal (green)
    { min: 35, max: 38, color: '#FACC15' },        // Warm (yellow)
    { min: 38, max: 40, color: '#FB923C' },        // Hot (orange)
    { min: 40, max: Infinity, color: '#EF4444' },  // Critical (red)
  ];
  
  // Get color for temperature
  const getColorForTemperature = (temp: number): string => {
    for (const range of temperatureRanges) {
      if (temp >= range.min && temp < range.max) {
        return range.color;
      }
    }
    return temperatureRanges[0].color;
  };
  
  // Draw thermal data on canvas
  useEffect(() => {
    if (!canvasRef.current || !data) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const cellSize = size / 8;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw thermal grid
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const temp = data.grid[y][x];
        ctx.fillStyle = getColorForTemperature(temp);
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        
        // Draw cell border
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [data, size]);
  
  if (!data) {
    return (
      <div 
        className="bg-slate-800 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="text-slate-400">No thermal data available</div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-lg border border-slate-700"
      />
    </div>
  );
};

export default ThermalVisualization;