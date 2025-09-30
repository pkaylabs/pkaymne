import { sampleObjectives } from "@/constants/data";
import { Objective, ObjectiveFormData } from "@/types";
import { getPriorityColor, getStatusColor } from "@/utils";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Edit,
  Search,
  Target,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressBar } from "./progress-bar";
import { ObjectiveForm } from "./form";
import { Modal } from "@/components/core/modal";

export const Table = () => {
  const [objectives, setObjectives] = useState<Objective[]>(sampleObjectives);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<
    Objective | undefined
  >();
  const [sortField, setSortField] = useState<keyof Objective>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredObjectives = useMemo(() => {
    return objectives
      .filter((objective) => {
        const matchesSearch =
          objective.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          objective.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          objective.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || objective.status === statusFilter;
        const matchesPriority =
          priorityFilter === "All" || objective.priority === priorityFilter;
        const matchesCategory =
          categoryFilter === "All" || objective.category === categoryFilter;

        return (
          matchesSearch && matchesStatus && matchesPriority && matchesCategory
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
    objectives,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortField,
    sortDirection,
  ]);

  // Unique filter options
  const uniqueCategories = Array.from(
    new Set(objectives.map((obj) => obj.category))
  );

  const handleSort = (field: keyof Objective) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFormSubmit = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      // Update existing objective
      setObjectives(
        objectives.map((obj) =>
          obj.id === editingObjective.id
            ? { ...obj, ...formData, progress: obj.progress }
            : obj
        )
      );
    } else {
      // Add new objective
      const newObjective: Objective = {
        ...formData,
        id: Math.max(...objectives.map((o) => o.id)) + 1,
        progress: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setObjectives([...objectives, newObjective]);
    }
    setIsModalOpen(false);
  };

  const handleAddObjective = () => {
    setEditingObjective(undefined);
    setIsModalOpen(true);
  };

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective);
    setIsModalOpen(true);
  };

  const handleDeleteObjective = (id: number) => {
    if (window.confirm("Are you sure you want to delete this objective?")) {
      setObjectives(objectives.filter((obj) => obj.id !== id));
    }
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search outcomes..."
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
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredObjectives.length} of {objectives.length} outcomes
        </div>
      </div>

      {/* Objectives Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700 bg-gray-750">
              <tr className="text-gray-400 text-sm text-nowrap">
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Outcome Name{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("numIndicators")}
                >
                  Indicators{" "}
                  {sortField === "numIndicators" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortField === "status" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("priority")}
                >
                  Priority{" "}
                  {sortField === "priority" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("assignedTo")}
                >
                  Assigned To{" "}
                  {sortField === "assignedTo" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left p-4 font-medium">Progress</th>
                <th
                  className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date{" "}
                  {sortField === "dueDate" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredObjectives.map((objective) => (
                <tr
                  key={objective.id}
                  className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750 transition-colors text-nowrap"
                >
                  <td className="p-4">
                    <div>
                      <div className="text-white font-medium mb-1">
                        {objective.name}
                      </div>
                      <div className="text-gray-400 text-sm line-clamp-2">
                        {objective.description}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {objective.category}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">
                        {objective.numIndicators}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(objective.status)}`}
                    >
                      {objective.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div
                      className={`flex items-center space-x-1 ${getPriorityColor(objective.priority)}`}
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">{objective.priority}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {objective.assignedTo
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-white">{objective.assignedTo}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          {objective.progress}%
                        </span>
                      </div>
                      <ProgressBar progress={objective.progress} />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">
                        {objective.dueDate}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditObjective(objective)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all"
                        title="Edit objective"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteObjective(objective.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-all"
                        title="Delete objective"
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
        {filteredObjectives.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              No objectives found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ||
              statusFilter !== "All" ||
              priorityFilter !== "All" ||
              categoryFilter !== "All"
                ? "Try adjusting your search criteria or filters"
                : "Get started by creating your first objective"}
            </p>
            {!searchTerm &&
              statusFilter === "All" &&
              priorityFilter === "All" &&
              categoryFilter === "All" && (
                <button
                  onClick={handleAddObjective}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Create First Objective
                </button>
              )}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingObjective ? "Edit Outcome" : "Add New Outcome"}
      >
        <ObjectiveForm
          objective={editingObjective}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};
