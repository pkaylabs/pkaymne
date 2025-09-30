import React, { useState, useMemo } from 'react';
import { 
  Plus,
  BarChart3,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StatsCard } from '@/components/core/stats-card';
import { Indicator, IndicatorFormData } from '@/types';
import { calculateStatus } from '@/utils';
import { Modal } from '@/components/core/modal';
import { IndicatorForm } from './components/form';
import { sampleIndicators } from '@/constants/data';
import { Table } from '../objectives/components/table';

const IndicatorPage: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>(sampleIndicators);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | undefined>();

  const stats = useMemo(() => {
    const total = indicators.length;
    const onTrack = indicators.filter(ind => ind.status === 'On Track').length;
    const atRisk = indicators.filter(ind => ind.status === 'At Risk').length;
    const achieved = indicators.filter(ind => ind.status === 'Achieved').length;
    
    const avgPerformance = Math.round(
      indicators.reduce((sum, ind) => {
        const progress = ind.target === ind.baseline ? 0 : 
          ((ind.actual - ind.baseline) / (ind.target - ind.baseline)) * 100;
        return sum + Math.max(0, Math.min(100, progress));
      }, 0) / total
    );
    
    return { total, onTrack, atRisk, achieved, avgPerformance };
  }, [indicators]);

  const handleFormSubmit = (formData: IndicatorFormData) => {
    const status = calculateStatus(formData.baseline, formData.target, formData.actual);
    
    if (editingIndicator) {
      // Update existing indicator
      setIndicators(indicators.map(ind => 
        ind.id === editingIndicator.id 
          ? { ...ind, ...formData, status, updatedAt: new Date().toISOString().split('T')[0] }
          : ind
      ));
    } else {
      // Add new indicator
      const newIndicator: Indicator = {
        ...formData,
        id: Math.max(...indicators.map(i => i.id)) + 1,
        status,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setIndicators([...indicators, newIndicator]);
    }
    setIsModalOpen(false);
  };

  const handleAddIndicator = () => {
    setEditingIndicator(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Indicators</h1>
            <p className="text-gray-400">Track and monitor key performance indicators</p>
          </div>
          <button
            onClick={handleAddIndicator}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Indicator</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Indicators"
            value={stats.total}
            icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
            color="bg-blue-900"
          />
          <StatsCard
            title="On Track"
            value={stats.onTrack}
            change="+5"
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6 text-green-400" />}
            color="bg-green-900"
          />
          <StatsCard
            title="At Risk"
            value={stats.atRisk}
            change="-2"
            changeType="positive"
            icon={<AlertTriangle className="w-6 h-6 text-yellow-400" />}
            color="bg-yellow-900"
          />
          <StatsCard
            title="Completed"
            value={stats.achieved}
            change="+3"
            changeType="positive"
            icon={<CheckCircle2 className="w-6 h-6 text-purple-400" />}
            color="bg-purple-900"
          />
          <StatsCard
            title="Avg Performance"
            value={`${stats.avgPerformance}%`}
            change="+12%"
            changeType="positive"
            icon={<Target className="w-6 h-6 text-orange-400" />}
            color="bg-orange-900"
          />
        </div>

        {/* Table */}
        <Table />

        {/* Modal for Add Indicator */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingIndicator ? 'Edit Indicator' : 'Add New Indicator'}
        >
          <IndicatorForm
            indicator={editingIndicator}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default IndicatorPage;