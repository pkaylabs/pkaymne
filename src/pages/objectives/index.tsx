import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  User,
  BarChart3,
  AlertCircle
} from 'lucide-react';

// Types
interface Objective {
  id: number;
  name: string;
  description: string;
  numIndicators: any;
  status: 'Active' | 'Completed' | 'Pending' | 'On Hold';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  createdAt: string;
  dueDate: string;
  progress: number;
  category: string;
}

interface ObjectiveFormData {
  name: string;
  description: string;
  numIndicators: any;
  status: 'Active' | 'Completed' | 'Pending' | 'On Hold';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  dueDate: string;
  category: string;
}

// Sample data
const sampleObjectives: Objective[] = [
  {
    id: 1,
    name: 'An industrialised and diversified economy',
    description: 'Increase industrial satisfaction scores by 20% through improved service delivery',
    numIndicators: 5,
    status: 'Active',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-15',
    dueDate: '2024-06-30',
    progress: 75,
    category: 'Human Resources'
  },
  {
    id: 2,
    name: 'Enhanced citizenry participation in the economy',
    description: 'Decrease average customer support response time to under 2 hours',
    numIndicators: 3,
    status: 'Active',
    priority: 'High',
    assignedTo: 'Mike Chen',
    createdAt: '2024-02-01',
    dueDate: '2024-04-15',
    progress: 45,
    category: 'Policy and Planning'
  },
  {
    id: 3,
    name: 'Competitive private sector',
    description: 'Complete comprehensive training for all customer service representatives',
    numIndicators: 8,
    status: 'Completed',
    priority: 'Medium',
    assignedTo: 'Lisa Rodriguez',
    createdAt: '2023-12-10',
    dueDate: '2024-03-01',
    progress: 100,
    category: 'Research'
  },
  {
    id: 4,
    name: 'System Integration',
    description: 'Integrate new CRM system with existing customer database',
    numIndicators: 12,
    status: 'Pending',
    priority: 'High',
    assignedTo: 'David Kim',
    createdAt: '2024-02-20',
    dueDate: '2024-08-15',
    progress: 20,
    category: 'Information Technology'
  },
  {
    id: 5,
    name: 'Market Research Analysis',
    description: 'Conduct comprehensive market analysis for Q2 strategy planning',
    numIndicators: 6,
    status: 'On Hold',
    priority: 'Medium',
    assignedTo: 'Emma Wilson',
    createdAt: '2024-01-30',
    dueDate: '2024-05-20',
    progress: 30,
    category: 'Finance'
  },
  {
    id: 6,
    name: 'Revenue Growth Initiative',
    description: 'Implement strategies to achieve 25% revenue growth this quarter',
    numIndicators: 10,
    status: 'Active',
    priority: 'High',
    assignedTo: 'James Smith',
    createdAt: '2024-01-05',
    dueDate: '2024-03-31',
    progress: 60,
    category: 'Procurement'
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
        <div className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-green-400' : 
          changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {change}
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
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
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

// Objective Form Component
const ObjectiveForm: React.FC<{
  objective?: Objective;
  onSubmit: (data: ObjectiveFormData) => void;
  onCancel: () => void;
}> = ({ objective, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ObjectiveFormData>({
    name: objective?.name || '',
    description: objective?.description || '',
    numIndicators: objective?.numIndicators || 1,
    status: objective?.status || 'Pending',
    priority: objective?.priority || 'Medium',
    assignedTo: objective?.assignedTo || '',
    dueDate: objective?.dueDate || '',
    category: objective?.category || ''
  });

  const [errors, setErrors] = useState<Partial<ObjectiveFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<ObjectiveFormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.numIndicators < 1) newErrors.numIndicators = 'Must have at least 1 indicator';
    if (!formData.assignedTo.trim()) newErrors.assignedTo = 'Assigned person is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.category.trim()) newErrors.category = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const categories = ['Human Resources', 'Policy and Planning', 'Research', 'Information Technology', 'Research', 'Procurement', 'Finance'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Outcome Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="Enter outcome name"
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
          placeholder="Enter objective description"
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Row 1: Indicators and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Indicators *
          </label>
          <input
            type="number"
            min="1"
            value={formData.numIndicators}
            onChange={(e) => setFormData({ ...formData, numIndicators: parseInt(e.target.value) })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {errors.numIndicators && <p className="text-red-400 text-sm mt-1">{errors.numIndicators}</p>}
        </div>

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
      </div>

      {/* Row 2: Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Row 3: Assigned To and Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Assigned To *
          </label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Enter assignee name"
          />
          {errors.assignedTo && <p className="text-red-400 text-sm mt-1">{errors.assignedTo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {errors.dueDate && <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {objective ? 'Update Objective' : 'Create Objective'}
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

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = "" }) => (
  <div className={`bg-gray-700 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Main Objectives Page Component
const ObjectivesPage: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>(sampleObjectives);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | undefined>();
  const [sortField, setSortField] = useState<keyof Objective>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Calculate stats
  const stats = useMemo(() => {
    const total = objectives.length;
    const active = objectives.filter(obj => obj.status === 'Active').length;
    const completed = objectives.filter(obj => obj.status === 'Completed').length;
    const avgProgress = Math.round(objectives.reduce((sum, obj) => sum + obj.progress, 0) / total);
    
    return { total, active, completed, avgProgress };
  }, [objectives]);

  // Filter and search logic
  const filteredObjectives = useMemo(() => {
    return objectives.filter(objective => {
      const matchesSearch = objective.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           objective.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           objective.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || objective.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || objective.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'All' || objective.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    }).sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [objectives, searchTerm, statusFilter, priorityFilter, categoryFilter, sortField, sortDirection]);

  // Unique filter options
  const uniqueCategories = Array.from(new Set(objectives.map(obj => obj.category)));

  const handleSort = (field: keyof Objective) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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
    if (window.confirm('Are you sure you want to delete this objective?')) {
      setObjectives(objectives.filter(obj => obj.id !== id));
    }
  };

  const handleFormSubmit = (formData: ObjectiveFormData) => {
    if (editingObjective) {
      // Update existing objective
      setObjectives(objectives.map(obj => 
        obj.id === editingObjective.id 
          ? { ...obj, ...formData, progress: obj.progress }
          : obj
      ));
    } else {
      // Add new objective
      const newObjective: Objective = {
        ...formData,
        id: Math.max(...objectives.map(o => o.id)) + 1,
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setObjectives([...objectives, newObjective]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-900 text-green-300 border-green-700';
      case 'Completed': return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'Pending': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'On Hold': return 'bg-red-900 text-red-300 border-red-700';
      default: return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Development Outcomes</h1>
            <p className="text-gray-400">Manage and track your organizational outcomes</p>
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
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
                    onClick={() => handleSort('name')}
                  >
                    Outcome Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('numIndicators')}
                  >
                    Indicators {sortField === 'numIndicators' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('priority')}
                  >
                    Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('assignedTo')}
                  >
                    Assigned To {sortField === 'assignedTo' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left p-4 font-medium">Progress</th>
                  <th 
                    className="text-left p-4 font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('dueDate')}
                  >
                    Due Date {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                        <div className="text-white font-medium mb-1">{objective.name}</div>
                        <div className="text-gray-400 text-sm line-clamp-2">{objective.description}</div>
                        <div className="text-gray-500 text-xs mt-1">{objective.category}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium">{objective.numIndicators}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(objective.status)}`}>
                        {objective.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center space-x-1 ${getPriorityColor(objective.priority)}`}>
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">{objective.priority}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {objective.assignedTo.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-white">{objective.assignedTo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">{objective.progress}%</span>
                        </div>
                        <ProgressBar progress={objective.progress} />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{objective.dueDate}</span>
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
              <h3 className="text-lg font-medium text-gray-400 mb-2">No objectives found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All'
                  ? 'Try adjusting your search criteria or filters'
                  : 'Get started by creating your first objective'
                }
              </p>
              {(!searchTerm && statusFilter === 'All' && priorityFilter === 'All' && categoryFilter === 'All') && (
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

        {/* Modal for Add/Edit Objective */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingObjective ? 'Edit Outcome' : 'Add New Outcome'}
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