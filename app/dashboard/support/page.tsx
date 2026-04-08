"use client";

// Hydration fix: Remove dynamic content that differs between server/client

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ISSUE_TYPES = [
  "Billing/Payment",
  "Technical Issue",
  "Feature Request",
  "Account Access",
  "Other",
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: "",
    issueType: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Please sign in to submit a ticket");
      }

      const { error: insertError } = await supabase
        .from("support_tickets")
        .insert({
          user_id: userData.user.id,
          email: userData.user.email,
          subject: formData.subject,
          issue_type: formData.issueType,
          description: formData.description,
          status: "open",
          created_at: new Date().toISOString() // Client-only date is fine for hydration
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      setFormData({ subject: "", issueType: "", description: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">Ticket Submitted</h2>
          <p className="mt-2 text-gray-600">
            We've received your support request. Our team will respond within 24 hours at your registered email.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Submit Another Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
        <p className="text-gray-600 mt-2">
          Having issues with TextFlow? Submit a ticket and our team will help you resolve it.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of your issue"
            />
          </div>

          <div>
            <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Type *
            </label>
            <select
              id="issueType"
              name="issueType"
              required
              value={formData.issueType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an issue type</option>
              {ISSUE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide detailed information about your issue, including any error messages or steps to reproduce."
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Support Ticket"}
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Typical response time: within 24 hours during business days.
            </p>
          </div>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-blue-600 font-medium mb-2">Email Support</div>
          <p className="text-sm text-gray-600">support@textflow.tech</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-blue-600 font-medium mb-2">Phone</div>
          <p className="text-sm text-gray-600">+1 (800) 555-0123 (9 AM - 5 PM EST)</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-blue-600 font-medium mb-2">Documentation</div>
          <p className="text-sm text-gray-600">
            <a href="/docs" className="text-blue-600 hover:underline">
              Browse help articles →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}