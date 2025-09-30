import { Upload, User } from "lucide-react";
import { SettingsSection } from "../section";
import { useState } from "react";
import { type UserSettings } from "@/types";
import {
  departments,
  languages,
  sampleUser,
  timezones,
} from "@/constants/data";
import { FormInput } from "../input";
import { FormSelect } from "../select";

export const ProfileSection = () => {
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
      title="Profile Information"
      description="Update your personal information and contact details"
      icon={<User className="w-5 h-5 text-blue-400" />}
    >
      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {settings.profile.firstName[0]}
            {settings.profile.lastName[0]}
          </div>
          <div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
            <p className="text-gray-400 text-sm mt-1">
              JPG, PNG or GIF (max 2MB)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="First Name"
            value={settings.profile.firstName}
            onChange={(value) => updateSettings("profile", "firstName", value)}
            required
          />
          <FormInput
            label="Last Name"
            value={settings.profile.lastName}
            onChange={(value) => updateSettings("profile", "lastName", value)}
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            value={settings.profile.email}
            onChange={(value) => updateSettings("profile", "email", value)}
            required
          />
          <FormInput
            label="Phone Number"
            type="tel"
            value={settings.profile.phone}
            onChange={(value) => updateSettings("profile", "phone", value)}
          />
          <FormInput
            label="Job Title"
            value={settings.profile.jobTitle}
            onChange={(value) => updateSettings("profile", "jobTitle", value)}
          />
          <FormSelect
            label="Department"
            value={settings.profile.department}
            onChange={(value) => updateSettings("profile", "department", value)}
            options={departments}
          />
          <FormSelect
            label="Timezone"
            value={settings.profile.timezone}
            onChange={(value) => updateSettings("profile", "timezone", value)}
            options={timezones}
          />
          <FormSelect
            label="Language"
            value={settings.profile.language}
            onChange={(value) => updateSettings("profile", "language", value)}
            options={languages}
          />
        </div>
      </div>
    </SettingsSection>
  );
};
