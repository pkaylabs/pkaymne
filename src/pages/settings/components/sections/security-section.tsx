import React, { useState } from "react";
import { SettingsSection } from "../section";
import { Lock } from "lucide-react";
import { ToggleSwitch } from "../toggle";
import { UserSettings } from "@/types";
import { sampleUser } from "@/constants/data";
import { FormSelect } from "../select";

export const SecuritySection = () => {
  const [settings, setSettings] = useState<UserSettings>(sampleUser);

  const updateSettings = (
    section: keyof UserSettings,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <SettingsSection
      title="Security & Authentication"
      description="Manage your account security and login preferences"
      icon={<Lock className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">
                  Two-Factor Authentication
                </label>
                <p className="text-gray-400 text-sm">
                  Add an extra layer of security
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.security.twoFactorEnabled}
                onChange={(value) =>
                  updateSettings("security", "twoFactorEnabled", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">
                  Login Notifications
                </label>
                <p className="text-gray-400 text-sm">
                  Get notified of new logins
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.security.loginNotifications}
                onChange={(value) =>
                  updateSettings("security", "loginNotifications", value)
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <FormSelect
              label="Session Timeout"
              value={settings.security.sessionTimeout.toString()}
              onChange={(value) =>
                updateSettings("security", "sessionTimeout", parseInt(value))
              }
              options={[
                { value: "60", label: "1 hour" },
                { value: "240", label: "4 hours" },
                { value: "480", label: "8 hours" },
                { value: "720", label: "12 hours" },
                { value: "1440", label: "24 hours" },
              ]}
            />
            <FormSelect
              label="Password Expiry"
              value={settings.security.passwordExpiry.toString()}
              onChange={(value) =>
                updateSettings("security", "passwordExpiry", parseInt(value))
              }
              options={[
                { value: "30", label: "30 days" },
                { value: "60", label: "60 days" },
                { value: "90", label: "90 days" },
                { value: "180", label: "6 months" },
                { value: "365", label: "1 year" },
              ]}
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-white font-medium mb-4">Password & Security</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Change Password
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Download Security Report
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              View Login History
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              Sign Out All Devices
            </button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};
