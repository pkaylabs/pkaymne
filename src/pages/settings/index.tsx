import React, { useState } from 'react';
import { 
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Smartphone,
  Save,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Cog,
  Monitor,
  Moon,
  Sun,
  BarChart3,
  Lock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

// Types
interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    department: string;
    timezone: string;
    language: string;
    avatar: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    weeklyReports: boolean;
    objectiveUpdates: boolean;
    indicatorAlerts: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    soundEnabled: boolean;
    defaultDashboard: string;
    itemsPerPage: number;
    autoRefresh: boolean;
    refreshInterval: number;
    compactMode: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'team' | 'private';
    showOnlineStatus: boolean;
    allowDataExport: boolean;
    shareAnalytics: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    loginNotifications: boolean;
  };
}

// Settings Section Component
const SettingsSection: React.FC<{
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

// Toggle Switch Component
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-gray-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Form Input Component
const FormInput: React.FC<{
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}> = ({ label, type = 'text', value, onChange, placeholder, disabled = false, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

// Select Component
const FormSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}> = ({ label, value, onChange, options, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Notification Item Component
const NotificationItem: React.FC<{
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

// Main Settings Page Component
const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      jobTitle: 'Senior Manager',
      department: 'Operations',
      timezone: 'America/New_York',
      language: 'en',
      avatar: ''
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReports: true,
      objectiveUpdates: true,
      indicatorAlerts: true,
      systemUpdates: false,
      marketingEmails: false
    },
    preferences: {
      theme: 'dark',
      soundEnabled: true,
      defaultDashboard: 'main',
      itemsPerPage: 25,
      autoRefresh: true,
      refreshInterval: 300,
      compactMode: false
    },
    privacy: {
      profileVisibility: 'team',
      showOnlineStatus: true,
      allowDataExport: true,
      shareAnalytics: false
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 480,
      passwordExpiry: 90,
      loginNotifications: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ja', label: 'Japanese' }
  ];

  const departments = [
    { value: 'Operations', label: 'Operations' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Customer Service', label: 'Customer Service' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
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
          <SettingsSection
            title="Profile Information"
            description="Update your personal information and contact details"
            icon={<User className="w-5 h-5 text-blue-400" />}
          >
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {settings.profile.firstName[0]}{settings.profile.lastName[0]}
                </div>
                <div>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </button>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG or GIF (max 2MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  value={settings.profile.firstName}
                  onChange={(value) => updateSettings('profile', 'firstName', value)}
                  required
                />
                <FormInput
                  label="Last Name"
                  value={settings.profile.lastName}
                  onChange={(value) => updateSettings('profile', 'lastName', value)}
                  required
                />
                <FormInput
                  label="Email Address"
                  type="email"
                  value={settings.profile.email}
                  onChange={(value) => updateSettings('profile', 'email', value)}
                  required
                />
                <FormInput
                  label="Phone Number"
                  type="tel"
                  value={settings.profile.phone}
                  onChange={(value) => updateSettings('profile', 'phone', value)}
                />
                <FormInput
                  label="Job Title"
                  value={settings.profile.jobTitle}
                  onChange={(value) => updateSettings('profile', 'jobTitle', value)}
                />
                <FormSelect
                  label="Department"
                  value={settings.profile.department}
                  onChange={(value) => updateSettings('profile', 'department', value)}
                  options={departments}
                />
                <FormSelect
                  label="Timezone"
                  value={settings.profile.timezone}
                  onChange={(value) => updateSettings('profile', 'timezone', value)}
                  options={timezones}
                />
                <FormSelect
                  label="Language"
                  value={settings.profile.language}
                  onChange={(value) => updateSettings('profile', 'language', value)}
                  options={languages}
                />
              </div>
            </div>
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection
            title="Notifications"
            description="Choose how you want to receive updates and alerts"
            icon={<Bell className="w-5 h-5 text-blue-400" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-4">Communication Channels</h4>
                <div className="space-y-4">
                  <NotificationItem
                    title="Email Notifications"
                    description="Receive updates via email"
                    enabled={settings.notifications.email}
                    onChange={(value) => updateSettings('notifications', 'email', value)}
                    icon={<Mail className="w-5 h-5" />}
                  />
                  <NotificationItem
                    title="Push Notifications"
                    description="Browser and app notifications"
                    enabled={settings.notifications.push}
                    onChange={(value) => updateSettings('notifications', 'push', value)}
                    icon={<Smartphone className="w-5 h-5" />}
                  />
                  <NotificationItem
                    title="SMS Notifications"
                    description="Text message alerts"
                    enabled={settings.notifications.sms}
                    onChange={(value) => updateSettings('notifications', 'sms', value)}
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
                    onChange={(value) => updateSettings('notifications', 'weeklyReports', value)}
                    icon={<BarChart3 className="w-5 h-5" />}
                  />
                  <NotificationItem
                    title="Objective Updates"
                    description="Changes to objectives you're involved in"
                    enabled={settings.notifications.objectiveUpdates}
                    onChange={(value) => updateSettings('notifications', 'objectiveUpdates', value)}
                    icon={<Bell className="w-5 h-5" />}
                  />
                  <NotificationItem
                    title="Indicator Alerts"
                    description="When indicators go off track"
                    enabled={settings.notifications.indicatorAlerts}
                    onChange={(value) => updateSettings('notifications', 'indicatorAlerts', value)}
                    icon={<AlertTriangle className="w-5 h-5" />}
                  />
                  <NotificationItem
                    title="System Updates"
                    description="Platform maintenance and updates"
                    enabled={settings.notifications.systemUpdates}
                    onChange={(value) => updateSettings('notifications', 'systemUpdates', value)}
                    icon={<Cog className="w-5 h-5" />}
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Preferences */}
          <SettingsSection
            title="Display & Preferences"
            description="Customize your dashboard experience"
            icon={<Palette className="w-5 h-5 text-blue-400" />}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                      { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                      { value: 'auto', label: 'Auto', icon: <Monitor className="w-4 h-4" /> }
                    ].map(theme => (
                      <button
                        key={theme.value}
                        onClick={() => updateSettings('preferences', 'theme', theme.value)}
                        className={`p-3 rounded-lg border transition-colors flex flex-col items-center space-y-2 ${
                          settings.preferences.theme === theme.value
                            ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                            : 'border-gray-600 bg-gray-700 text-gray-400 hover:border-gray-500'
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
                    onChange={(value) => updateSettings('preferences', 'defaultDashboard', value)}
                    options={[
                      { value: 'main', label: 'Main Dashboard' },
                      { value: 'objectives', label: 'Objectives' },
                      { value: 'indicators', label: 'Indicators' },
                      { value: 'reports', label: 'Reports' }
                    ]}
                  />
                  <FormSelect
                    label="Items Per Page"
                    value={settings.preferences.itemsPerPage.toString()}
                    onChange={(value) => updateSettings('preferences', 'itemsPerPage', parseInt(value))}
                    options={[
                      { value: '10', label: '10 items' },
                      { value: '25', label: '25 items' },
                      { value: '50', label: '50 items' },
                      { value: '100', label: '100 items' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Sound Effects</label>
                      <p className="text-gray-400 text-sm">Play sounds for notifications</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.preferences.soundEnabled}
                      onChange={(value) => updateSettings('preferences', 'soundEnabled', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Auto Refresh</label>
                      <p className="text-gray-400 text-sm">Automatically refresh dashboard data</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.preferences.autoRefresh}
                      onChange={(value) => updateSettings('preferences', 'autoRefresh', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Compact Mode</label>
                      <p className="text-gray-400 text-sm">Reduce spacing and padding</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.preferences.compactMode}
                      onChange={(value) => updateSettings('preferences', 'compactMode', value)}
                    />
                  </div>
                </div>

                {settings.preferences.autoRefresh && (
                  <div>
                    <FormSelect
                      label="Refresh Interval"
                      value={settings.preferences.refreshInterval.toString()}
                      onChange={(value) => updateSettings('preferences', 'refreshInterval', parseInt(value))}
                      options={[
                        { value: '60', label: '1 minute' },
                        { value: '300', label: '5 minutes' },
                        { value: '600', label: '10 minutes' },
                        { value: '1800', label: '30 minutes' },
                        { value: '3600', label: '1 hour' }
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          </SettingsSection>

          {/* Privacy Settings */}
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
                    onChange={(value) => updateSettings('privacy', 'profileVisibility', value)}
                    options={[
                      { value: 'public', label: 'Public - Visible to everyone' },
                      { value: 'team', label: 'Team - Visible to team members' },
                      { value: 'private', label: 'Private - Only visible to you' }
                    ]}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Show Online Status</label>
                      <p className="text-gray-400 text-sm">Let others see when you're online</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.privacy.showOnlineStatus}
                      onChange={(value) => updateSettings('privacy', 'showOnlineStatus', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Allow Data Export</label>
                      <p className="text-gray-400 text-sm">Enable downloading your data</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.privacy.allowDataExport}
                      onChange={(value) => updateSettings('privacy', 'allowDataExport', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Share Analytics</label>
                      <p className="text-gray-400 text-sm">Help improve the platform</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.privacy.shareAnalytics}
                      onChange={(value) => updateSettings('privacy', 'shareAnalytics', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Security Settings */}
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
                      <label className="text-white font-medium">Two-Factor Authentication</label>
                      <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.security.twoFactorEnabled}
                      onChange={(value) => updateSettings('security', 'twoFactorEnabled', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Login Notifications</label>
                      <p className="text-gray-400 text-sm">Get notified of new logins</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.security.loginNotifications}
                      onChange={(value) => updateSettings('security', 'loginNotifications', value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <FormSelect
                    label="Session Timeout"
                    value={settings.security.sessionTimeout.toString()}
                    onChange={(value) => updateSettings('security', 'sessionTimeout', parseInt(value))}
                    options={[
                      { value: '60', label: '1 hour' },
                      { value: '240', label: '4 hours' },
                      { value: '480', label: '8 hours' },
                      { value: '720', label: '12 hours' },
                      { value: '1440', label: '24 hours' }
                    ]}
                  />
                  <FormSelect
                    label="Password Expiry"
                    value={settings.security.passwordExpiry.toString()}
                    onChange={(value) => updateSettings('security', 'passwordExpiry', parseInt(value))}
                    options={[
                      { value: '30', label: '30 days' },
                      { value: '60', label: '60 days' },
                      { value: '90', label: '90 days' },
                      { value: '180', label: '6 months' },
                      { value: '365', label: '1 year' }
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

          {/* Data Management */}
          <SettingsSection
            title="Data Management"
            description="Manage your data, backups, and account actions"
            icon={<Database className="w-5 h-5 text-blue-400" />}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-4">Data Export & Backup</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Export All Data</div>
                          <div className="text-gray-400 text-sm">Download complete data archive</div>
                        </div>
                      </div>
                    </button>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Upload className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Import Settings</div>
                          <div className="text-gray-400 text-sm">Restore from backup file</div>
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
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Reports</span>
                        <span className="text-gray-400">845 MB</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Cache</span>
                        <span className="text-gray-400">156 MB</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '8%' }}></div>
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

          {/* System Information */}
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
                      All systems are operational. Next maintenance window is scheduled for March 25, 2024 at 2:00 AM UTC.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>
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