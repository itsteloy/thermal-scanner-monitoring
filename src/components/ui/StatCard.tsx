import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  isPositive?: boolean;
  color?: string;
  unit?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  isPositive = true, 
  color = 'bg-primary',
  unit
}: StatCardProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-md border border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-white">{value}</p>
            {unit && <span className="ml-1 text-sm text-slate-400">{unit}</span>}
          </div>
          {change && (
            <p className={`mt-1 text-xs flex items-center ${isPositive ? 'text-success' : 'text-danger'}`}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{change}</span>
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;