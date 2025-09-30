import React, { useState, useMemo } from "react";
import {
  Calendar,
  Target,
  BarChart3,
  FileText,
  Download,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Users,
  Clock,
  Award,
  Eye,
  Share2,
} from "lucide-react";
import { type ReportFilters as Filters } from "@/types";
import { sampleIndicatorsR } from "@/constants/data";
import { ReportFilters } from "./components/report-filters";
import { StatsCard } from "@/components/core/stats-card";
import { PerformanceChart } from "./components/performance-chart";
import { StatusDistribution } from "./components/status-dist";
import { DetailedReportTable } from "./components/report-table";

const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    objectives: [],
    indicators: [],
    categories: [],
    assignees: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    // If no filters are applied at all, show all data
    const hasAnyFilters =
      filters.objectives.length > 0 ||
      filters.indicators.length > 0 ||
      filters.categories.length > 0 ||
      filters.assignees.length > 0;

    if (!hasAnyFilters) {
      return sampleIndicatorsR;
    }

    return sampleIndicatorsR.filter((indicator) => {
      const objectiveMatch =
        filters.objectives.length === 0 ||
        filters.objectives.includes(indicator.objective);
      const indicatorMatch =
        filters.indicators.length === 0 ||
        filters.indicators.includes(indicator.name);
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(indicator.category);
      const assigneeMatch =
        filters.assignees.length === 0 ||
        filters.assignees.includes(indicator.assignee);

      return objectiveMatch && indicatorMatch && categoryMatch && assigneeMatch;
    });
  }, [filters]);

  // Calculate report stats
  const reportStats = useMemo(() => {
    const total = filteredData.length;
    const onTrack = filteredData.filter(
      (ind) => ind.status === "On Track"
    ).length;
    const achieved = filteredData.filter(
      (ind) => ind.status === "Achieved"
    ).length;
    const atRisk = filteredData.filter(
      (ind) => ind.status === "At Risk"
    ).length;

    const avgProgress =
      total > 0
        ? Math.round(
            filteredData.reduce((sum, ind) => {
              const progress =
                ind.target === ind.baseline
                  ? 0
                  : ((ind.actual - ind.baseline) /
                      (ind.target - ind.baseline)) *
                    100;
              return sum + Math.max(0, Math.min(100, progress));
            }, 0) / total
          )
        : 0;

    return { total, onTrack, achieved, atRisk, avgProgress };
  }, [filteredData]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsGenerating(false);
    setReportGenerated(true);
  };

  const handleExportReport = () => {
    // In a real application, this would generate and download a report file
    const reportData = {
      filters,
      stats: reportStats,
      data: filteredData,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split("T")[0]}.json`;
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
            <p className="text-gray-400">
              Generate comprehensive performance reports with custom filters
            </p>
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
                      <span>
                        {reportStats.achieved} indicators have achieved their
                        targets
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>
                        {reportStats.onTrack} indicators are on track to meet
                        targets
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span>
                        {reportStats.atRisk} indicators need attention
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span>
                        Overall progress is at {reportStats.avgProgress}%
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Recommendations</h4>
                  <ul className="space-y-2 text-gray-300">
                    {reportStats.atRisk > 0 && (
                      <li className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                        <span>
                          Focus resources on at-risk indicators to prevent
                          further decline
                        </span>
                      </li>
                    )}
                    {reportStats.achieved > 0 && (
                      <li className="flex items-start space-x-2">
                        <Award className="w-4 h-4 text-purple-400 mt-0.5" />
                        <span>
                          Celebrate and document successful strategies from
                          achieved indicators
                        </span>
                      </li>
                    )}
                    <li className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-blue-400 mt-0.5" />
                      <span>
                        Regular team reviews to maintain momentum on tracking
                        indicators
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-green-400 mt-0.5" />
                      <span>
                        Consider adjusting targets based on current performance
                        trends
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>
                    Report generated on {new Date().toLocaleDateString()}
                  </span>
                  <span>
                    Data range: {filters.dateRange.startDate} to{" "}
                    {filters.dateRange.endDate}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!reportGenerated && !isGenerating && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready to Generate Report
            </h3>
            <p className="text-gray-400 mb-6">
              Configure your filters above and click "Generate Report" to create
              a comprehensive performance analysis
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-gray-700 rounded-lg p-4">
                <Calendar className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Date Range</h4>
                <p className="text-gray-400 text-sm">
                  Select the time period for your analysis
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <Target className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Objectives</h4>
                <p className="text-gray-400 text-sm">
                  Choose specific objectives to include
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <BarChart3 className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Indicators</h4>
                <p className="text-gray-400 text-sm">
                  Select indicators to analyze performance
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
            <RefreshCw className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Generating Report
            </h3>
            <p className="text-gray-400">
              Processing your selected data and creating comprehensive
              analytics...
            </p>
            <div className="mt-6 bg-gray-700 rounded-full h-2 max-w-xs mx-auto">
              <div
                className="bg-blue-500 h-2 rounded-full animate-pulse"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
