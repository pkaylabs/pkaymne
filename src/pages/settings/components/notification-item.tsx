import { ToggleSwitch } from "./toggle";

export const NotificationItem: React.FC<{
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  icon: React.ReactNode;
}> = ({ title, description, enabled, onChange, icon }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors">
    <div className="flex items-center space-x-3">
      <div className="text-gray-400">
        {icon}
      </div>
      <div>
        <div className="text-white font-medium">{title}</div>
        <div className="text-gray-400 text-sm">{description}</div>
      </div>
    </div>
    <ToggleSwitch enabled={enabled} onChange={onChange} />
  </div>
);