import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { SettingsSection } from "../section";
import { useState } from "react";
import { type UserSettings } from "@/types";
import { sampleUser } from "@/constants/data";
import { FormSelect } from "../select";
import { ToggleSwitch } from "../toggle";

export const PreferenceSection = () => {
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
      title="Display & Preferences"
      description="Customize your dashboard experience"
      icon={<Palette className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "light",
                  label: "Light",
                  icon: <Sun className="w-4 h-4" />,
                },
                {
                  value: "dark",
                  label: "Dark",
                  icon: <Moon className="w-4 h-4" />,
                },
                {
                  value: "auto",
                  label: "Auto",
                  icon: <Monitor className="w-4 h-4" />,
                },
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() =>
                    updateSettings("preferences", "theme", theme.value)
                  }
                  className={`p-3 rounded-lg border transition-colors flex flex-col items-center space-y-2 ${
                    settings.preferences.theme === theme.value
                      ? "border-blue-500 bg-blue-900/30 text-blue-400"
                      : "border-gray-600 bg-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {theme.icon}
                  <span className="text-sm">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <FormSelect
              label="Default Dashboard"
              value={settings.preferences.defaultDashboard}
              onChange={(value) =>
                updateSettings("preferences", "defaultDashboard", value)
              }
              options={[
                { value: "main", label: "Main Dashboard" },
                { value: "objectives", label: "Objectives" },
                { value: "indicators", label: "Indicators" },
                { value: "reports", label: "Reports" },
              ]}
            />
            <FormSelect
              label="Items Per Page"
              value={settings.preferences.itemsPerPage.toString()}
              onChange={(value) =>
                updateSettings("preferences", "itemsPerPage", parseInt(value))
              }
              options={[
                { value: "10", label: "10 items" },
                { value: "25", label: "25 items" },
                { value: "50", label: "50 items" },
                { value: "100", label: "100 items" },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Sound Effects</label>
                <p className="text-gray-400 text-sm">
                  Play sounds for notifications
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.preferences.soundEnabled}
                onChange={(value) =>
                  updateSettings("preferences", "soundEnabled", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Auto Refresh</label>
                <p className="text-gray-400 text-sm">
                  Automatically refresh dashboard data
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.preferences.autoRefresh}
                onChange={(value) =>
                  updateSettings("preferences", "autoRefresh", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Compact Mode</label>
                <p className="text-gray-400 text-sm">
                  Reduce spacing and padding
                </p>
              </div>
              <ToggleSwitch
                enabled={settings.preferences.compactMode}
                onChange={(value) =>
                  updateSettings("preferences", "compactMode", value)
                }
              />
            </div>
          </div>

          {settings.preferences.autoRefresh && (
            <div>
              <FormSelect
                label="Refresh Interval"
                value={settings.preferences.refreshInterval.toString()}
                onChange={(value) =>
                  updateSettings(
                    "preferences",
                    "refreshInterval",
                    parseInt(value)
                  )
                }
                options={[
                  { value: "60", label: "1 minute" },
                  { value: "300", label: "5 minutes" },
                  { value: "600", label: "10 minutes" },
                  { value: "1800", label: "30 minutes" },
                  { value: "3600", label: "1 hour" },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
};
