import { Indicator, IndicatorFormData } from "@/types";
import { useState } from "react";

export const IndicatorForm: React.FC<{
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

  const categories = ['Human Resources', 'Policy and Planning', 'Research', 'Finance', 'Procurement'];
  const objectives = [
    'An industrialised and diversified economy', 
    'Enhanced citizenry participation in the economy',
    'Competitive private sector',
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
            Related Outcome *
          </label>
          <select
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="">Select Outcome</option>
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