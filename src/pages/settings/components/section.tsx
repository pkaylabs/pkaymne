

export const SettingsSection: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, icon, children }) => (
  <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-blue-900 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
    {children}
  </div>
);