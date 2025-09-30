

export const FormSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}> = ({ label, value, onChange, options, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);