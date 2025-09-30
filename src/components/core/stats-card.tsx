import { ArrowDown, ArrowUp } from "lucide-react";

type StatsCardType = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardType> = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
      {change && (
        <div className={`text-sm font-medium flex items-center space-x-1 ${
          changeType === 'positive' ? 'text-green-400' : 
          changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {changeType === 'positive' && <ArrowUp className="w-4 h-4" />}
          {changeType === 'negative' && <ArrowDown className="w-4 h-4" />}
          <span>{change}</span>
        </div>
      )}
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);