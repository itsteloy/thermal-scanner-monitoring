import { useState } from 'react';
import { Lightbulb, Sun, Moon } from 'lucide-react';

const LightingPage = () => {
  const [lightIntensity, setLightIntensity] = useState(70);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [schedule, setSchedule] = useState({
    morning: '07:00',
    evening: '19:00',
  });
  
  // Mock data for lighting zones
  const zones = [
    { id: 1, name: 'Zone A', status: 'active', intensity: 80 },
    { id: 2, name: 'Zone B', status: 'active', intensity: 65 },
    { id: 3, name: 'Zone C', status: 'inactive', intensity: 0 },
    { id: 4, name: 'Zone D', status: 'active', intensity: 75 },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lighting Controls</h1>
        <p className="text-slate-400 mt-1">
          Manage and monitor lighting settings
        </p>
      </div>
      
      {/* Main control card */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium mb-4">Main Lighting Control</h2>
            <div className="flex items-center mb-6">
              <Moon size={20} className="text-slate-400" />
              <div className="flex-1 mx-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <Sun size={20} className="text-warning" />
              <span className="ml-2 text-lg font-medium">{lightIntensity}%</span>
            </div>
            
            <div className="flex items-center mb-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={autoAdjust}
                    onChange={() => setAutoAdjust(!autoAdjust)}
                  />
                  <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      autoAdjust ? 'transform translate-x-6 bg-primary' : ''
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-white">Auto-adjustment</div>
              </label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Morning Start</label>
                <input
                  type="time"
                  value={schedule.morning}
                  onChange={(e) => setSchedule({ ...schedule, morning: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Evening Start</label>
                <input
                  type="time"
                  value={schedule.evening}
                  onChange={(e) => setSchedule({ ...schedule, evening: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded py-2 px-3 text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-b from-warning/30 to-primary/30 border-4 border-warning">
              <Lightbulb
                size={64}
                className={`${
                  lightIntensity > 80
                    ? 'text-warning animate-pulse'
                    : lightIntensity > 50
                    ? 'text-warning'
                    : lightIntensity > 20
                    ? 'text-warning/70'
                    : 'text-warning/40'
                }`}
              />
            </div>
            <p className="mt-2 text-center text-slate-300">
              {lightIntensity > 80
                ? 'Very Bright'
                : lightIntensity > 50
                ? 'Optimal'
                : lightIntensity > 20
                ? 'Dim'
                : 'Very Dim'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Zone controls */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-medium">Lighting Zones</h2>
        </div>
        
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-slate-700 rounded-lg p-4 border border-slate-600"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">{zone.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    zone.status === 'active' ? 'bg-success/20 text-success' : 'bg-slate-600 text-slate-400'
                  }`}
                >
                  {zone.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {zone.status === 'active' ? (
                <>
                  <div className="flex items-center mb-2">
                    <Sun size={16} className="text-warning" />
                    <div className="w-full mx-2">
                      <div className="h-1.5 bg-slate-600 rounded-full">
                        <div
                          className="h-1.5 bg-warning rounded-full"
                          style={{ width: `${zone.intensity}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm">{zone.intensity}%</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button className="px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-500 transition-colors">
                      Adjust
                    </button>
                    <button className="px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-500 transition-colors">
                      Turn Off
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center mt-4">
                  <button className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-colors">
                    Turn On
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LightingPage;