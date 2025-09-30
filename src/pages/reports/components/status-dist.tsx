import { IndicatorData } from "@/types";
import { PieChart } from "lucide-react";

export const StatusDistribution: React.FC<{ data: IndicatorData[] }> = ({ data }) => {
  const statusCounts = data.reduce((acc, indicator) => {
    acc[indicator.status] = (acc[indicator.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colors = {
    'On Track': '#10b981',
    'At Risk': '#f59e0b',
    'Off Track': '#ef4444',
    'Achieved': '#3b82f6'
  };

  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <PieChart className="w-5 h-5" />
        <span>Status Distribution</span>
      </h3>
      
      <div className="space-y-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return (
            <div key={status} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{status}</span>
                <span className="text-white font-medium">{count} ({percentage}%)</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: colors[status as keyof typeof colors] || '#6b7280'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};