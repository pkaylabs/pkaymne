import { IndicatorData } from "@/types";
import { Activity, AlertTriangle, BarChart3, CheckCircle, FileText, TrendingDown, TrendingUp } from "lucide-react";

export const DetailedReportTable: React.FC<{ data: IndicatorData[] }> = ({ data }) => {
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