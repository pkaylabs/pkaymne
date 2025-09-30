import React, { useState, useMemo } from "react";
import {
  Plus,
  Target,
  TrendingUp,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { Objective, ObjectiveFormData } from "@/types";
import { sampleObjectives } from "@/constants/data";
import { ObjectiveForm } from "./components/form";
import { Table } from "./components/table";
import { StatsCard } from "@/components/core/stats-card";
import { Modal } from "@/components/core/modal";


const ObjectivesPage: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>(sampleObjectives);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<
    Objective | undefined
  >();

  // Calculate stats
  const stats = useMemo(() => {
    const total = objectives.length;
    const active = objectives.filter((obj) => obj.status === "Active").length;
    const completed = objectives.filter(
      (obj) => obj.status === "Completed"
    ).length;
    const avgProgress = Math.round(
      objectives.reduce((sum, obj) => sum + obj.progress, 0) / total
    );

    return { total, active, completed, avgProgress };
  }, [objectives]);

  const handleAddObjective = () => {
    setEditingObjective(undefined);
    setIsModalOpen(true);
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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Development Outcomes
            </h1>
            <p className="text-gray-400">
              Manage and track your organizational outcomes
            </p>
          </div>
          <button
            onClick={handleAddObjective}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Outcome</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Outcomes"
            value={stats.total}
            icon={<Target className="w-6 h-6 text-blue-400" />}
            color="bg-blue-900"
          />
          <StatsCard
            title="Active Outcomes"
            value={stats.active}
            change="+12%"
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6 text-green-400" />}
            color="bg-green-900"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            change="+8%"
            changeType="positive"
            icon={<CheckCircle className="w-6 h-6 text-purple-400" />}
            color="bg-purple-900"
          />
          <StatsCard
            title="Average Progress"
            value={`${stats.avgProgress}%`}
            change="+5%"
            changeType="positive"
            icon={<BarChart3 className="w-6 h-6 text-orange-400" />}
            color="bg-orange-900"
          />
        </div>

        {/* Objective table */}
        <Table />

        {/* Modal for Add Objective */}
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
      </div>
    </div>
  );
};

export default ObjectivesPage;
