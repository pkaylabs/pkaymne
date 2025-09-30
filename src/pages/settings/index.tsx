import React, { useState } from "react";
import { Save, Download, RefreshCw, CheckCircle } from "lucide-react";
import { UserSettings } from "@/types";
import { sampleUser } from "@/constants/data";
import { ProfileSection } from "./components/sections/profile-section";
import { NotificationSection } from "./components/sections/notification-section";
import { PreferenceSection } from "./components/sections/preferences-section";
import { PrivacySection } from "./components/sections/privacy-section";
import { SecuritySection } from "./components/sections/security-section";
import { DataManagementSection } from "./components/sections/data-section";
import { SystemInfoSection } from "./components/sections/system-section";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(sampleUser);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      settings,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportData}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export Data</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300">Settings saved successfully!</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Settings */}
          <ProfileSection />

          {/* Notifications */}
          <NotificationSection />

          {/* Preferences */}
          <PreferenceSection />

          {/* Privacy Settings */}
          <PrivacySection />

          {/* Security Settings */}
          <SecuritySection />

          {/* Data Management */}
          <DataManagementSection />

          {/* System Information */}
          <SystemInfoSection />
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-8 border-t border-gray-700">
          <div className="text-gray-400 text-sm">
            Last saved: {new Date().toLocaleString()}
          </div>
          <div className="flex space-x-3">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
