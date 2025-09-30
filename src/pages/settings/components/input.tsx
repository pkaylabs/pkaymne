

export const FormInput: React.FC<{
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}> = ({ label, type = 'text', value, onChange, placeholder, disabled = false, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);