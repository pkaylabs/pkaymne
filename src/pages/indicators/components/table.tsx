import { sampleIndicators } from "@/constants/data";
import { Indicator, IndicatorFormData } from "@/types";
import { calculateStatus } from "@/utils";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Edit,
  Minus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PerformanceIndicator } from "./performance-indicator";
import { Modal } from "@/components/core/modal";
import { IndicatorForm } from "./form";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "On Track":
      return "bg-green-900 text-green-300 border-green-700";
    case "Achieved":
      return "bg-blue-900 text-blue-300 border-blue-700";
    case "At Risk":
      return "bg-yellow-900 text-yellow-300 border-yellow-700";
    case "Off Track":
      return "bg-red-900 text-red-300 border-red-700";
    default:
      return "bg-gray-900 text-gray-300 border-gray-700";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "On Track":
      return <TrendingUp className="w-4 h-4" />;
    case "Achieved":
      return <CheckCircle2 className="w-4 h-4" />;
    case "At Risk":
      return <AlertTriangle className="w-4 h-4" />;
    case "Off Track":
      return <TrendingDown className="w-4 h-4" />;
    default:
      return <Minus className="w-4 h-4" />;
  }
};

export const table = () => {
  const [indicators, setIndicators] = useState<Indicator[]>(sampleIndicators);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<
    Indicator | undefined
  >();
  const [sortField, setSortField] = useState<keyof Indicator>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter and search logic
  const filteredIndicators = useMemo(() => {
    return indicators
      .filter((indicator) => {
        const matchesSearch =
          indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          indicator.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          indicator.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
          indicator.objective.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || indicator.status === statusFilter;
        const matchesCategory =
          categoryFilter === "All" || indicator.category === categoryFilter;
        const matchesFrequency =
          frequencyFilter === "All" || indicator.frequency === frequencyFilter;

        return (
          matchesSearch && matchesStatus && matchesCategory && matchesFrequency
        );
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    indicators,
    searchTerm,
    statusFilter,
    categoryFilter,
    frequencyFilter,
    sortField,
    sortDirection,
  ]);

  // Unique filter options
  const uniqueCategories = Array.from(
    new Set(indicators.map((ind) => ind.category))
  );

  const handleSort = (field: keyof Indicator) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddIndicator = () => {
    setEditingIndicator(undefined);
    setIsModalOpen(true);
  };

  const handleEditIndicator = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setIsModalOpen(true);
  };

  const handleDeleteIndicator = (id: number) => {
    if (window.confirm("Are you sure you want to delete this indicator?")) {
      setIndicators(indicators.filter((ind) => ind.id !== id));
    }
  };

  const handleFormSubmit = (formData: IndicatorFormData) => {
    const status = calculateStatus(
      formData.baseline,
      formData.target,
      formData.actual
    );

    if (editingIndicator) {
      // Update existing indicator
      setIndicators(
        indicators.map((ind) =>
          ind.id === editingIndicator.id
            ? {
                ...ind,
                ...formData,
                status,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : ind
        )
      );
    } else {
      // Add new indicator
      const newIndicator: Indicator = {
        ...formData,
        id: Math.max(...indicators.map((i) => i.id)) + 1,
        status,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setIndicators([...indicators, newIndicator]);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="All">All Status</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Off Track">Off Track</option>
              <option value="Achieved">Achieved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="All">All Departments</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency Filter */}
          <div>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="All">All Frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredIndicators.length} of {indicators.length} indicators
        </div>
      </div>

      {/* Indicators Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700 bg-gray-750">
              <tr className="text-gray-400 text-sm text-nowrap">
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Indicator Name{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left p-4 font-medium">Metrics</th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortField === "status" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left p-4 font-medium">Performance</th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("assignee")}
                >
                  Assignee{" "}
                  {sortField === "assignee" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("frequency")}
                >
                  Frequency{" "}
                  {sortField === "frequency" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("updatedAt")}
                >
                  Updated{" "}
                  {sortField === "updatedAt" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.map((indicator) => (
                <tr
                  key={indicator.id}
                  className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors text-nowrap"
                >
                  <td className="p-4">
                    <div className="">
                      <div className="text-white font-medium mb-1">
                        {indicator.name}
                      </div>
                      <div className="text-gray-400 text-sm line-clamp-1">
                        {indicator.description}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-gray-500 text-xs">
                          {indicator.category}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500 text-xs">
                          {indicator.objective}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 min-w-90">
                    <div className="space-y-1 text-sm">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Baseline:</span>
                          <div className="text-white font-medium">
                            {indicator.baseline} {indicator.unit}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Target:</span>
                          <div className="text-white font-medium">
                            {indicator.target} {indicator.unit}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Current:</span>
                          <div className="text-white font-medium">
                            {indicator.actual} {indicator.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(indicator.status)}`}
                    >
                      {getStatusIcon(indicator.status)}
                      <span>{indicator.status}</span>
                    </div>
                  </td>
                  <td className="p-4 w-48">
                    <PerformanceIndicator
                      baseline={indicator.baseline}
                      target={indicator.target}
                      actual={indicator.actual}
                      unit={indicator.unit}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {indicator.assignee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-white">{indicator.assignee}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {indicator.frequency}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {indicator.updatedAt}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditIndicator(indicator)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all"
                        title="Edit indicator"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteIndicator(indicator.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all"
                        title="Delete indicator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredIndicators.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              No indicators found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ||
              statusFilter !== "All" ||
              categoryFilter !== "All" ||
              frequencyFilter !== "All"
                ? "Try adjusting your search criteria or filters"
                : "Get started by creating your first indicator"}
            </p>
            {!searchTerm &&
              statusFilter === "All" &&
              categoryFilter === "All" &&
              frequencyFilter === "All" && (
                <button
                  onClick={handleAddIndicator}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Create First Indicator
                </button>
              )}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndicator ? "Edit Indicator" : "Add New Indicator"}
      >
        <IndicatorForm
          indicator={editingIndicator}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};
