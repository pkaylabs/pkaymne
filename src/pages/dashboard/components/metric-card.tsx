import { MetricCardProps } from '@/types';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  subtitle,
}) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 hover:scale-105 transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-300 text-sm font-medium">{title}</span>
      <div className="text-gray-300 hover:text-gray-400 transition-colors">
        {icon}
      </div>
    </div>
    <div className="space-y-2">
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-gray-400 text-sm">{subtitle}</div>}
      {change && (
        <div
          className={`flex items-center text-sm ${
            changeType === "positive" ? "text-green-400" : "text-red-400"
          }`}
        >
          {changeType === "positive" ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {change} since last month
        </div>
      )}
    </div>
  </div>
);
