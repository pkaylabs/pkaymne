import React, { useState, useMemo } from 'react';
import { 
  Calendar,
  Target,
  BarChart3,
  FileText,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  PieChart,
  LineChart,
  Users,
  Clock,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  Share2
} from 'lucide-react';

// Types
interface ReportFilters {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  objectives: string[];
  indicators: string[];
  categories: string[];
  assignees: string[];
}

interface ObjectiveData {
  id: number;
  name: string;
  category: string;
  status: string;
  progress: number;
  indicators: IndicatorData[];
}

interface IndicatorData {
  id: number;
  name: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
  status: string;
  objective: string;
  assignee: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  history: { date: string; value: number }[];
}

// Sample data
const sampleObjectives: ObjectiveData[] = [
  {
    id: 1,
    name: 'Increase Customer Satisfaction',
    category: 'Customer Service',
    status: 'Active',
    progress: 75,
    indicators: []
  },
  {
    id: 2,
    name: 'Reduce Response Time',
    category: 'Operations',
    status: 'Active',
    progress: 85,
    indicators: []
  },
  {
    id: 3,
    name: 'Employee Training Program',
    category: 'Human Resources',
    status: 'Completed',
    progress: 100,
    indicators: []
  },
  {
    id: 4,
    name: 'Revenue Growth Initiative',
    category: 'Sales',
    status: 'Active',
    progress: 60,
    indicators: []
  }
];

const sampleIndicators: IndicatorData[] = [
  {
    id: 1,
    name: 'Customer Satisfaction Score',
    baseline: 3.2,
    target: 4.5,
    actual: 4.1,
    unit: 'Score (1-5)',
    status: 'On Track',
    objective: 'Increase Customer Satisfaction',
    assignee: 'Sarah Johnson',
    category: 'Customer Service',
    trend: 'up',
    history: [
      { date: '2024-01-01', value: 3.2 },
      { date: '2024-02-01', value: 3.5 },
      { date: '2024-03-01', value: 3.8 },
      { date: '2024-04-01', value: 4.1 }
    ]
  },
  {
    id: 2,
    name: 'Average Response Time',
    baseline: 4.5,
    target: 2.0,
    actual: 2.3,
    unit: 'Hours',
    status: 'On Track',
    objective: 'Reduce Response Time',
    assignee: 'Mike Chen',
    category: 'Operations',
    trend: 'down',
    history: [
      { date: '2024-01-01', value: 4.5 },
      { date: '2024-02-01', value: 3.8 },
      { date: '2024-03-01', value: 2.9 },
      { date: '2024-04-01', value: 2.3 }
    ]
  },
  {
    id: 3,
    name: 'Training Completion Rate',
    baseline: 65,
    target: 95,
    actual: 88,
    unit: 'Percentage',
    status: 'On Track',
    objective: 'Employee Training Program',
    assignee: 'Lisa Rodriguez',
    category: 'Human Resources',
    trend: 'up',
    history: [
      { date: '2024-01-01', value: 65 },
      { date: '2024-02-01', value: 72 },
      { date: '2024-03-01', value: 80 },
      { date: '2024-04-01', value: 88 }
    ]
  },
  {
    id: 4,
    name: 'Revenue Per Customer',
    baseline: 1250,
    target: 1600,
    actual: 1520,
    unit: 'USD',
    status: 'On Track',
    objective: 'Revenue Growth Initiative',
    assignee: 'James Smith',
    category: 'Sales',
    trend: 'up',
    history: [
      { date: '2024-01-01', value: 1250 },
      { date: '2024-02-01', value: 1320 },
      { date: '2024-03-01', value: 1420 },
      { date: '2024-04-01', value: 1520 }
    ]
  },
  {
    id: 5,
    name: 'Employee Satisfaction',
    baseline: 3.8,
    target: 4.3,
    actual: 4.5,
    unit: 'Score (1-5)',
    status: 'Achieved',
    objective: 'Employee Training Program',
    assignee: 'Lisa Rodriguez',
    category: 'Human Resources',
    trend: 'up',
    history: [
      { date: '2024-01-01', value: 3.8 },
      { date: '2024-02-01', value: 4.0 },
      { date: '2024-03-01', value: 4.2 },
      { date: '2024-04-01', value: 4.5 }
    ]
  }
];

// Report Filter Component
const ReportFilters: React.FC<{
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}> = ({ filters, onFiltersChange, onGenerate, isGenerating }) => {
  const uniqueCategories = Array.from(new Set(sampleIndicators.map(ind => ind.category)));
  const uniqueAssignees = Array.from(new Set(sampleIndicators.map(ind => ind.assignee)));

  const handleFilterChange = (key: keyof ReportFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleMultiSelect = (key: keyof ReportFilters, value: string, checked: boolean) => {
    const currentValues = filters[key] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    handleFilterChange(key, newValues);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Filter className="w-6 h-6" />
          <span>Report Filters</span>
        </h2>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Generate Report</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Range */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Date Range</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.dateRange.startDate}
                onChange={(e) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  startDate: e.target.value
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={filters.dateRange.endDate}
                onChange={(e) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  endDate: e.target.value
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Quick Presets</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 30 Days', days: 30 },
              { label: 'Last 90 Days', days: 90 },
              { label: 'Last Year', days: 365 }
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  const endDate = new Date().toISOString().split('T')[0];
                  const startDate = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                  handleFilterChange('dateRange', { startDate, endDate });
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Objectives Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Objectives</span>
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sampleObjectives.map(objective => (
              <label key={objective.id} className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.objectives.includes(objective.name)}
                  onChange={(e) => handleMultiSelect('objectives', objective.name, e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <div className="flex-1">
                  <span className="text-white text-sm">{objective.name}</span>
                  <div className="text-gray-400 text-xs">{objective.category}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Indicators Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Indicators</span>
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sampleIndicators.map(indicator => (
              <label key={indicator.id} className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.indicators.includes(indicator.name)}
                  onChange={(e) => handleMultiSelect('indicators', indicator.name, e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <div className="flex-1">
                  <span className="text-white text-sm">{indicator.name}</span>
                  <div className="text-gray-400 text-xs">{indicator.category}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Categories</h3>
          <div className="space-y-2">
            {uniqueCategories.map(category => (
              <label key={category} className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => handleMultiSelect('categories', category, e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <span className="text-white text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Assignees */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Assignees</h3>
          <div className="space-y-2">
            {uniqueAssignees.map(assignee => (
              <label key={assignee} className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.assignees.includes(assignee)}
                  onChange={(e) => handleMultiSelect('assignees', assignee, e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {assignee.split(' ').map((n: any) => n[0]).join('')}
                  </div>
                  <span className="text-white text-sm">{assignee}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
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

// Performance Chart Component
const PerformanceChart: React.FC<{ data: IndicatorData[] }> = ({ data }) => {
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

// Status Distribution Chart
const StatusDistribution: React.FC<{ data: IndicatorData[] }> = ({ data }) => {
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

// Detailed Report Table
const DetailedReportTable: React.FC<{ data: IndicatorData[] }> = ({ data }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Track': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'Achieved': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'At Risk': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'Off Track': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const calculateProgress = (baseline: number, target: number, actual: number) => {
    if (target === baseline) return 0;
    return ((actual - baseline) / (target - baseline)) * 100;
  };

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Detailed Report</span>
          </h3>
        </div>
        <div className="p-12 text-center">
          <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No Data to Display</h3>
          <p className="text-gray-500">
            No indicators match your current filter criteria. Try adjusting your selections.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Detailed Report</span>
          </h3>
          <span className="text-sm text-gray-400">{data.length} indicators</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-700 bg-gray-750">
            <tr className="text-gray-400 text-sm">
              <th className="text-left p-4 font-medium">Indicator</th>
              <th className="text-left p-4 font-medium">Baseline</th>
              <th className="text-left p-4 font-medium">Target</th>
              <th className="text-left p-4 font-medium">Current</th>
              <th className="text-left p-4 font-medium">Progress</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {data.map((indicator) => {
              const progress = calculateProgress(indicator.baseline, indicator.target, indicator.actual);
              return (
                <tr key={indicator.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors text-nowrap">
                  <td className="p-4">
                    <div>
                      <div className="text-white font-medium">{indicator.name}</div>
                      <div className="text-gray-400 text-sm">{indicator.category}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{indicator.baseline} {indicator.unit}</td>
                  <td className="p-4 text-gray-300">{indicator.target} {indicator.unit}</td>
                  <td className="p-4 text-white font-medium">{indicator.actual} {indicator.unit}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-700 rounded-full h-2 w-20">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300 min-w-12">{Math.round(progress)}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(indicator.status)}
                      <span className="text-gray-300">{indicator.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {indicator.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-gray-300 text-sm">{indicator.assignee}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Reports Page Component
const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    objectives: [],
    indicators: [],
    categories: [],
    assignees: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    // If no filters are applied at all, show all data
    const hasAnyFilters = filters.objectives.length > 0 || 
                         filters.indicators.length > 0 || 
                         filters.categories.length > 0 || 
                         filters.assignees.length > 0;
    
    if (!hasAnyFilters) {
      return sampleIndicators;
    }
    
    return sampleIndicators.filter(indicator => {
      const objectiveMatch = filters.objectives.length === 0 || filters.objectives.includes(indicator.objective);
      const indicatorMatch = filters.indicators.length === 0 || filters.indicators.includes(indicator.name);
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(indicator.category);
      const assigneeMatch = filters.assignees.length === 0 || filters.assignees.includes(indicator.assignee);
      
      return objectiveMatch && indicatorMatch && categoryMatch && assigneeMatch;
    });
  }, [filters]);

  // Calculate report stats
  const reportStats = useMemo(() => {
    const total = filteredData.length;
    const onTrack = filteredData.filter(ind => ind.status === 'On Track').length;
    const achieved = filteredData.filter(ind => ind.status === 'Achieved').length;
    const atRisk = filteredData.filter(ind => ind.status === 'At Risk').length;
    
    const avgProgress = total > 0 ? Math.round(
      filteredData.reduce((sum, ind) => {
        const progress = ind.target === ind.baseline ? 0 : 
          ((ind.actual - ind.baseline) / (ind.target - ind.baseline)) * 100;
        return sum + Math.max(0, Math.min(100, progress));
      }, 0) / total
    ) : 0;
    
    return { total, onTrack, achieved, atRisk, avgProgress };
  }, [filteredData]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setReportGenerated(true);
  };

  const handleExportReport = () => {
    // In a real application, this would generate and download a report file
    const reportData = {
      filters,
      stats: reportStats,
      data: filteredData,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
            <p className="text-gray-400">Generate comprehensive performance reports with custom filters</p>
          </div>
          {reportGenerated && (
            <div className="flex space-x-3">
              <button
                onClick={handleExportReport}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export Report</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>

        {/* Report Filters */}
        <ReportFilters
          filters={filters}
          onFiltersChange={setFilters}
          onGenerate={handleGenerateReport}
          isGenerating={isGenerating}
        />

        {/* Report Content */}
        {reportGenerated && (
          <>
            {/* Report Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Indicators"
                value={reportStats.total}
                icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
                color="bg-blue-900"
              />
              <StatsCard
                title="On Track"
                value={reportStats.onTrack}
                change="+15%"
                changeType="positive"
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                color="bg-green-900"
              />
              <StatsCard
                title="Achieved"
                value={reportStats.achieved}
                change="+25%"
                changeType="positive"
                icon={<CheckCircle className="w-6 h-6 text-purple-400" />}
                color="bg-purple-900"
              />
              <StatsCard
                title="Average Progress"
                value={`${reportStats.avgProgress}%`}
                change="+8%"
                changeType="positive"
                icon={<Target className="w-6 h-6 text-orange-400" />}
                color="bg-orange-900"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart data={filteredData} />
              <StatusDistribution data={filteredData} />
            </div>

            {/* Detailed Report Table */}
            <DetailedReportTable data={filteredData} />

            {/* Report Summary */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Executive Summary</span>
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Key Highlights</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{reportStats.achieved} indicators have achieved their targets</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>{reportStats.onTrack} indicators are on track to meet targets</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span>{reportStats.atRisk} indicators need attention</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span>Overall progress is at {reportStats.avgProgress}%</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Recommendations</h4>
                  <ul className="space-y-2 text-gray-300">
                    {reportStats.atRisk > 0 && (
                      <li className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                        <span>Focus resources on at-risk indicators to prevent further decline</span>
                      </li>
                    )}
                    {reportStats.achieved > 0 && (
                      <li className="flex items-start space-x-2">
                        <Award className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span>Celebrate and document successful strategies from achieved indicators</span>
                      </li>
                    )}
                    <li className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-blue-400 mt-0.5" />
                      <span>Regular team reviews to maintain momentum on tracking indicators</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-green-400 mt-0.5" />
                      <span>Consider adjusting targets based on current performance trends</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Report generated on {new Date().toLocaleDateString()}</span>
                  <span>Data range: {filters.dateRange.startDate} to {filters.dateRange.endDate}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!reportGenerated && !isGenerating && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Report</h3>
            <p className="text-gray-400 mb-6">
              Configure your filters above and click "Generate Report" to create a comprehensive performance analysis
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-gray-700 rounded-lg p-4">
                <Calendar className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Date Range</h4>
                <p className="text-gray-400 text-sm">Select the time period for your analysis</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <Target className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Objectives</h4>
                <p className="text-gray-400 text-sm">Choose specific objectives to include</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Indicators</h4>
                <p className="text-gray-400 text-sm">Select indicators to analyze performance</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <RefreshCw className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">Generating Report</h3>
            <p className="text-gray-400">
              Processing your selected data and creating comprehensive analytics...
            </p>
            <div className="mt-6 bg-gray-700 rounded-full h-2 max-w-xs mx-auto">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;