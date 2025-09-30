import { sampleIndicatorsR, sampleObjectivesR } from "@/constants/data";
import { type ReportFilters as Filters } from "@/types";
import { BarChart3, Calendar, FileText, Filter, RefreshCw, Target } from "lucide-react";

export const ReportFilters: React.FC<{
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}> = ({ filters, onFiltersChange, onGenerate, isGenerating }) => {
  const uniqueCategories = Array.from(new Set(sampleIndicatorsR.map(ind => ind.category)));
  const uniqueAssignees = Array.from(new Set(sampleIndicatorsR.map(ind => ind.assignee)));

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleMultiSelect = (key: keyof Filters, value: string, checked: boolean) => {
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
            <span>Development Outcomes</span>
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sampleObjectivesR.map(objective => (
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
            {sampleIndicatorsR.map(indicator => (
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
          <h3 className="text-lg font-medium text-white">Departments</h3>
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