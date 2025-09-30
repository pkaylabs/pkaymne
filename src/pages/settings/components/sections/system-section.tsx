import { SettingsSection } from "../section";
import { Info } from "lucide-react";

export const SystemInfoSection = () => {
  return (
    <SettingsSection
      title="System Information"
      description="View system details and support information"
      icon={<Info className="w-5 h-5 text-blue-400" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-white font-medium mb-4">Application Info</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Version</span>
              <span className="text-white">2.4.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Update</span>
              <span className="text-white">March 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Build</span>
              <span className="text-white">#2024.03.001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Environment</span>
              <span className="text-white">Production</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4">Support & Legal</h4>
          <div className="space-y-3">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-left">
              Help Center
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-left">
              Contact Support
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-left">
              Privacy Policy
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-left">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h5 className="text-blue-300 font-medium mb-1">System Status</h5>
              <p className="text-blue-200 text-sm">
                All systems are operational. Next maintenance window is
                scheduled for March 25, 2024 at 2:00 AM UTC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};
