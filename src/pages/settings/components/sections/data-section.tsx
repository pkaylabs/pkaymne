import React from "react";
import { SettingsSection } from "../section";
import {
  AlertTriangle,
  Database,
  Download,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";

export const DataManagementSection = () => {
  return (
    <SettingsSection
      title="Data Management"
      description="Manage your data, backups, and account actions"
      icon={<Database className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-4">
              Data Export & Backup
            </h4>
            <div className="space-y-3">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Export All Data</div>
                    <div className="text-gray-400 text-sm">
                      Download complete data archive
                    </div>
                  </div>
                </div>
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Import Settings</div>
                    <div className="text-gray-400 text-sm">
                      Restore from backup file
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Storage Usage</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Documents</span>
                  <span className="text-gray-400">2.4 GB</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Reports</span>
                  <span className="text-gray-400">845 MB</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "25%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Cache</span>
                  <span className="text-gray-400">156 MB</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "8%" }}
                  ></div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Total Used</span>
                  <span className="text-white font-medium">3.4 GB / 10 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-white font-medium mb-4">Account Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Clear Cache</span>
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Reset Settings</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center space-x-2">
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};
