import { IndicatorData } from "@/types";
import { Activity, LineChart, TrendingDown, TrendingUp } from "lucide-react";

export const PerformanceChart: React.FC<{ data: IndicatorData[] }> = ({ data }) => {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.flatMap(indicator => 
    indicator.history.map(point => point.value)
  ));

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <LineChart className="w-5 h-5" />
        <span>Performance Trends</span>
      </h3>
      
      <div className="space-y-6">
        {data.slice(0, 3).map((indicator, index) => (
          <div key={indicator.id}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">{indicator.name}</span>
              <div className="flex items-center space-x-2">
                {indicator.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : indicator.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Activity className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-300">{indicator.actual} {indicator.unit}</span>
              </div>
            </div>
            
            <div className="h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                
                <path
                  d={indicator.history.reduce((path, point, i) => {
                    const x = (i / (indicator.history.length - 1)) * 300;
                    const y = 60 - ((point.value / maxValue) * 50);
                    return path + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                  }, '')}
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                
                {indicator.history.map((point, i) => (
                  <circle
                    key={i}
                    cx={(i / (indicator.history.length - 1)) * 300}
                    cy={60 - ((point.value / maxValue) * 50)}
                    r="3"
                    fill="#3b82f6"
                    className="transition-all duration-300"
                  />
                ))}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};