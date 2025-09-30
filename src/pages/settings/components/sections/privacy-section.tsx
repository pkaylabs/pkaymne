import React, { useState } from "react";
import { SettingsSection } from "../section";
import { Shield } from "lucide-react";
import { FormSelect } from "../select";
import { UserSettings } from "@/types";
import { sampleUser } from "@/constants/data";
import { ToggleSwitch } from "../toggle";

export const PrivacySection = () => {
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
      title="Privacy & Data"
      description="Control your data visibility and sharing preferences"
      icon={<Shield className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormSelect
              label="Profile Visibility"
              value={settings.privacy.profileVisibility}
              onChange={(value) =>
                updateSettings("privacy", "profileVisibility", value)
              }
              options={[
                {
                  value: "public",
                  label: "Public - Visible to everyone",
                },
                {
                  value: "team",
                  label: "Team - Visible to team members",
                },
                {
                  value: "private",
                  label: "Private - Only visible to you",
                },
              ]}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">
                  Show Online Status
                </label>
                <p className="text-gray-400 text-sm">
                  Let others see when you're online
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.privacy.showOnlineStatus}
                onChange={(value) =>
                  updateSettings("privacy", "showOnlineStatus", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">
                  Allow Data Export
                </label>
                <p className="text-gray-400 text-sm">
                  Enable downloading your data
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.privacy.allowDataExport}
                onChange={(value) =>
                  updateSettings("privacy", "allowDataExport", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">
                  Share Analytics
                </label>
                <p className="text-gray-400 text-sm">
                  Help improve the platform
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.privacy.shareAnalytics}
                onChange={(value) =>
                  updateSettings("privacy", "shareAnalytics", value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};
