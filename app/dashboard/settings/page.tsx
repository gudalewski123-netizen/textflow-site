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

      // Save to user_profiles table in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userData.user.id,
          company_name: formData.companyName,
          timezone: formData.timezone,
          notifications_enabled: formData.notificationsEnabled,
          email_updates: formData.emailUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.user.id);

      if (error) {
        console.error("Failed to save settings:", error);
        throw error;
      }

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