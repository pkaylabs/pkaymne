import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  User,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

// Types
interface Indicator {
  id: number;
  name: string;
  description: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
  assignee: string;
  category: string;
  objective: string;
  createdAt: string;
  updatedAt: string;
  status: 'On Track' | 'At Risk' | 'Off Track' | 'Achieved';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
}

interface IndicatorFormData {
  name: string;
  description: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
  assignee: string;
  category: string;
  objective: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
}

// Sample data
const sampleIndicators: Indicator[] = [
  {
    id: 1,
    name: 'Share of Manufacturing value-added in GDP',
    description: 'Percentage of GDP contributed by the manufacturing sector',
    baseline: 3.2,
    target: 4.5,
    actual: 4.1,
    unit: 'Score (1-5)',
    assignee: 'Sarah Johnson',
    category: 'Human Resources',
    objective: 'Increase Customer Satisfaction',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    status: 'On Track',
    frequency: 'Monthly'
  },
  {
    id: 2,
    name: 'Share of Service value-added in GDP',
    description: 'Percentage of GDP contributed by the service sector',
    baseline: 4.5,
    target: 2.0,
    actual: 2.3,
    unit: 'Hours',
    assignee: 'Mike Chen',
    category: 'Policy and Planning',
    objective: 'Reduce Response Time',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-12',
    status: 'On Track',
    frequency: 'Daily'
  },
  {
    id: 3,
    name: 'Growth rate in export share of manufactures and services',
    description: 'Percentage increase in export share of manufactures and services',
    baseline: 65,
    target: 95,
    actual: 88,
    unit: 'Percentage',
    assignee: 'Lisa Rodriguez',
    category: 'Information Technology',
    objective: 'Employee Training Program',
    createdAt: '2023-12-10',
    updatedAt: '2024-03-08',
    status: 'On Track',
    frequency: 'Monthly'
  },
  {
    id: 4,
    name: 'Rank of top 5 commodity exports',
    description: 'Ranking of the top 5 commodities exported',
    baseline: 97.5,
    target: 99.9,
    actual: 98.2,
    unit: 'Percentage',
    assignee: 'David Kim',
    category: 'Research',
    objective: 'System Integration',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-13',
    status: 'At Risk',
    frequency: 'Daily'
  },
  {
    id: 5,
    name: 'Non-extractive export earnings',
    description: 'Percentage increase in non-extractive export earnings compared to previous period',
    baseline: 12.5,
    target: 18.0,
    actual: 11.8,
    unit: 'Percentage',
    assignee: 'Emma Wilson',
    category: 'Finance',
    objective: 'Market Research Analysis',
    createdAt: '2024-01-30',
    updatedAt: '2024-03-05',
    status: 'Off Track',
    frequency: 'Quarterly'
  },
  {
    id: 6,
    name: 'Youth employment rate',
    description: 'Percentage of youth (ages 15-24) who are employed',
    baseline: 40,
    target: 50,
    actual: 45,
    unit: 'Percentage',
    assignee: 'James Smith',
    category: 'Procurement',
    objective: 'Revenue Growth Initiative',
    createdAt: '2024-01-05',
    updatedAt: '2024-03-11',
    status: 'On Track',
    frequency: 'Monthly'
  },
  {
    id: 7,
    name: 'Services productivity growth rate',
    description: 'Percentage increase in productivity of the services sector',
    baseline: 3.8,
    target: 4.3,
    actual: 4.5,
    unit: 'Percentage',
    assignee: 'Lisa Rodriguez',
    category: 'Human Resources',
    objective: 'Employee Training Program',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-09',
    status: 'Achieved',
    frequency: 'Quarterly'
  },
  {
    id: 8,
    name: 'Manufacturing productivity growth rate',
    description: 'Percentage increase in productivity of the manufacturing sector',
    baseline: 2.8,
    target: 4.5,
    actual: 3.2,
    unit: 'Percentage',
    assignee: 'James Smith',
    category: 'Procurement',
    objective: 'Revenue Growth Initiative',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-12',
    status: 'At Risk',
    frequency: 'Weekly'
  }
];

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, changeType, icon, color }) => (
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

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Indicator Form Component
const IndicatorForm: React.FC<{
  indicator?: Indicator;
  onSubmit: (data: IndicatorFormData) => void;
  onCancel: () => void;
}> = ({ indicator, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<IndicatorFormData>({
    name: indicator?.name || '',
    description: indicator?.description || '',
    baseline: indicator?.baseline || 0,
    target: indicator?.target || 0,
    actual: indicator?.actual || 0,
    unit: indicator?.unit || '',
    assignee: indicator?.assignee || '',
    category: indicator?.category || '',
    objective: indicator?.objective || '',
    frequency: indicator?.frequency || 'Monthly'
  });

  const [errors, setErrors] = useState<Partial<IndicatorFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<IndicatorFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.assignee.trim()) newErrors.assignee = 'Assignee is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.objective.trim()) newErrors.objective = 'Objective is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const categories = ['Customer Service', 'Operations', 'Human Resources', 'Technology', 'Marketing', 'Sales', 'Finance'];
  const objectives = [
    'Increase Customer Satisfaction',
    'Reduce Response Time', 
    'Employee Training Program',
    'System Integration',
    'Market Research Analysis',
    'Revenue Growth Initiative'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Indicator Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="Enter indicator name"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="Enter indicator description"
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Baseline
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.baseline}
            onChange={(e) => setFormData({ ...formData, baseline: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Actual
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.actual}
            onChange={(e) => setFormData({ ...formData, actual: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Unit *
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="e.g., %, USD, Hours"
          />
          {errors.unit && <p className="text-red-400 text-sm mt-1">{errors.unit}</p>}
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Department *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
          </select>
        </div>
      </div>

      {/* Assignment Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Assigned To *
          </label>
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Enter assignee name"
          />
          {errors.assignee && <p className="text-red-400 text-sm mt-1">{errors.assignee}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Related Objective *
          </label>
          <select
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select objective</option>
            {objectives.map(obj => (
              <option key={obj} value={obj}>{obj}</option>
            ))}
          </select>
          {errors.objective && <p className="text-red-400 text-sm mt-1">{errors.objective}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {indicator ? 'Update Indicator' : 'Create Indicator'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Progress Component
const PerformanceIndicator: React.FC<{ 
  baseline: number; 
  target: number; 
  actual: number; 
  unit: string;
}> = ({ baseline, target, actual, unit }) => {
  const calculateProgress = () => {
    if (target === baseline) return 0;
    return ((actual - baseline) / (target - baseline)) * 100;
  };

  const progress = calculateProgress();
  const isImprovement = target > baseline;
  
  let status: 'success' | 'warning' | 'danger' = 'warning';
  if (progress >= 100) status = 'success';
  else if (progress < 50) status = 'danger';

  const getColor = () => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Progress</span>
        <span className="text-white font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        {actual} / {target} {unit}
      </div>
    </div>
  );
};

// Main Indicators Page Component
const IndicatorPage: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>(sampleIndicators);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | undefined>();
  const [sortField, setSortField] = useState<keyof Indicator>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Calculate stats
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

  // Filter and search logic
  const filteredIndicators = useMemo(() => {
    return indicators.filter(indicator => {
      const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           indicator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           indicator.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           indicator.objective.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || indicator.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || indicator.category === categoryFilter;
      const matchesFrequency = frequencyFilter === 'All' || indicator.frequency === frequencyFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesFrequency;
    }).sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [indicators, searchTerm, statusFilter, categoryFilter, frequencyFilter, sortField, sortDirection]);

  // Unique filter options
  const uniqueCategories = Array.from(new Set(indicators.map(ind => ind.category)));

  const handleSort = (field: keyof Indicator) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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
    if (window.confirm('Are you sure you want to delete this indicator?')) {
      setIndicators(indicators.filter(ind => ind.id !== id));
    }
  };

  const calculateStatus = (baseline: number, target: number, actual: number): Indicator['status'] => {
    if (target === baseline) return 'On Track';
    
    const progress = ((actual - baseline) / (target - baseline)) * 100;
    
    if (progress >= 100) return 'Achieved';
    if (progress >= 80) return 'On Track';
    if (progress >= 50) return 'At Risk';
    return 'Off Track';
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-900 text-green-300 border-green-700';
      case 'Achieved': return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'At Risk': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'Off Track': return 'bg-red-900 text-red-300 border-red-700';
      default: return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Track': return <TrendingUp className="w-4 h-4" />;
      case 'Achieved': return <CheckCircle2 className="w-4 h-4" />;
      case 'At Risk': return <AlertTriangle className="w-4 h-4" />;
      case 'Off Track': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
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

        {/* Search and Filters */}
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
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
                    onClick={() => handleSort('name')}
                  >
                    Indicator Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left p-4 font-medium">Metrics</th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left p-4 font-medium">Performance</th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('assignee')}
                  >
                    Assignee {sortField === 'assignee' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('frequency')}
                  >
                    Frequency {sortField === 'frequency' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('updatedAt')}
                  >
                    Updated {sortField === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                      <div className=''>
                        <div className="text-white font-medium mb-1">{indicator.name}</div>
                        <div className="text-gray-400 text-sm line-clamp-1">{indicator.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-gray-500 text-xs">{indicator.category}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-500 text-xs">{indicator.objective}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 min-w-90">
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Baseline:</span>
                            <div className="text-white font-medium">{indicator.baseline} {indicator.unit}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Target:</span>
                            <div className="text-white font-medium">{indicator.target} {indicator.unit}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Current:</span>
                            <div className="text-white font-medium">{indicator.actual} {indicator.unit}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border w-fit ${getStatusColor(indicator.status)}`}>
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
                          {indicator.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-white">{indicator.assignee}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{indicator.frequency}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{indicator.updatedAt}</span>
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
              <h3 className="text-lg font-medium text-gray-400 mb-2">No indicators found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'All' || categoryFilter !== 'All' || frequencyFilter !== 'All'
                  ? 'Try adjusting your search criteria or filters'
                  : 'Get started by creating your first indicator'
                }
              </p>
              {(!searchTerm && statusFilter === 'All' && categoryFilter === 'All' && frequencyFilter === 'All') && (
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

        {/* Modal for Add/Edit Indicator */}
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