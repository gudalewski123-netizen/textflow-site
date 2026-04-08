"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    timezone: "America/New_York",
    notificationsEnabled: true,
    emailUpdates: true,
  });

  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Please sign in to save settings");
      }

      // In a real app, you would save to a user_settings table
      // For now, we'll simulate a save
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-300 mt-2">Manage your TextFlow account preferences and integration.</p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">✓ Settings saved successfully</p>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-200 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full max-w-md px-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-200 mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full max-w-md px-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Bogota">Bogota Time (GMT-5)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </form>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-6">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Email Notifications</div>
              <p className="text-sm text-gray-300">Receive email updates about your account and campaigns</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailUpdates"
                name="emailUpdates"
                checked={formData.emailUpdates}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Push Notifications</div>
              <p className="text-sm text-gray-300">Get browser notifications for urgent support responses</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="notificationsEnabled"
                checked={formData.notificationsEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Integrations</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border-white/30 rounded-lg">
            <div className="flex items-center">
              <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 9.333l5.333 2.662-5.333 2.672V9.333zm14-4v14a4 4 0 01-4 4H4a4 4 0 01-4-4v-14a4 4 0 014-4h16a4 4 0 014 4z"/>
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">Google Calendar</div>
                <p className="text-sm text-gray-300">Sync your appointments and availability</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              Connect
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border-white/30 rounded-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">Stripe</div>
                <p className="text-sm text-gray-300">Manage billing and payments</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              Configure
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}