import {
  AlertTriangle,
  BarChart3,
  Bell,
  Cog,
  Mail,
  Smartphone,
} from "lucide-react";
import { SettingsSection } from "../section";
import { NotificationItem } from "../notification-item";
import { useState } from "react";
import { type UserSettings } from "@/types";
import { sampleUser } from "@/constants/data";

export const NotificationSection = () => {
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
      title="Notifications"
      description="Choose how you want to receive updates and alerts"
      icon={<Bell className="w-5 h-5 text-blue-400" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-white font-medium mb-4">
            Communication Channels
          </h4>
          <div className="space-y-4">
            <NotificationItem
              title="Email Notifications"
              description="Receive updates via email"
              enabled={settings.notifications.email}
              onChange={(value) =>
                updateSettings("notifications", "email", value)
              }
              icon={<Mail className="w-5 h-5" />}
            />
            <NotificationItem
              title="Push Notifications"
              description="Browser and app notifications"
              enabled={settings.notifications.push}
              onChange={(value) =>
                updateSettings("notifications", "push", value)
              }
              icon={<Smartphone className="w-5 h-5" />}
            />
            <NotificationItem
              title="SMS Notifications"
              description="Text message alerts"
              enabled={settings.notifications.sms}
              onChange={(value) =>
                updateSettings("notifications", "sms", value)
              }
              icon={<Smartphone className="w-5 h-5" />}
            />
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-4">Content Types</h4>
          <div className="space-y-4">
            <NotificationItem
              title="Weekly Reports"
              description="Summary of your weekly performance"
              enabled={settings.notifications.weeklyReports}
              onChange={(value) =>
                updateSettings("notifications", "weeklyReports", value)
              }
              icon={<BarChart3 className="w-5 h-5" />}
            />
            <NotificationItem
              title="Objective Updates"
              description="Changes to objectives you're involved in"
              enabled={settings.notifications.objectiveUpdates}
              onChange={(value) =>
                updateSettings("notifications", "objectiveUpdates", value)
              }
              icon={<Bell className="w-5 h-5" />}
            />
            <NotificationItem
              title="Indicator Alerts"
              description="When indicators go off track"
              enabled={settings.notifications.indicatorAlerts}
              onChange={(value) =>
                updateSettings("notifications", "indicatorAlerts", value)
              }
              icon={<AlertTriangle className="w-5 h-5" />}
            />
            <NotificationItem
              title="System Updates"
              description="Platform maintenance and updates"
              enabled={settings.notifications.systemUpdates}
              onChange={(value) =>
                updateSettings("notifications", "systemUpdates", value)
              }
              icon={<Cog className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};
