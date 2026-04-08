"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    messagesSent: 0,
    responseRate: "0%",
    balance: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        // In production, fetch real stats from API
        setStats({
          messagesSent: 1520,
          responseRate: "14.3%",
          balance: 2450.75,
        });
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-3">Welcome back, {user.email?.split("@")[0]}</h1>
        <p className="text-blue-100">
          Your AI voice calling and SMS platform is running smoothly.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-gray-500 text-sm font-medium">Messages Sent</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.messagesSent.toLocaleString()}</div>
          <div className="text-green-600 text-sm mt-1">+12% from last month</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-gray-500 text-sm font-medium">Response Rate</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.responseRate}</div>
          <div className="text-blue-600 text-sm mt-1">Industry average: 8%</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-gray-500 text-sm font-medium">Account Balance</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">${stats.balance.toLocaleString()}</div>
          <div className="text-gray-500 text-sm mt-1">SMS credits available</div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
          <div className="text-blue-600 font-bold text-lg mb-3">Start Campaign</div>
          <p className="text-gray-600 text-sm mb-4">Launch a new SMS or voice campaign</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create
          </button>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-6">
          <div className="text-green-600 font-bold text-lg mb-3">View Analytics</div>
          <p className="text-gray-600 text-sm mb-4">Campaign performance and insights</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
            Analyze
          </button>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-6">
          <div className="text-purple-600 font-bold text-lg mb-3">Calendar</div>
          <p className="text-gray-600 text-sm mb-4">Manage appointments and schedule</p>
          <button 
            onClick={() => router.push("/dashboard/calendar")}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Open
          </button>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6">
          <div className="text-amber-600 font-bold text-lg mb-3">Support</div>
          <p className="text-gray-600 text-sm mb-4">Get help or submit a ticket</p>
          <button 
            onClick={() => router.push("/dashboard/support")}
            className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-gray-500 text-sm mt-1">Last 24 hours of platform usage</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="text-blue-600 text-sm">📱</div>
                </div>
                <div>
                  <div className="font-medium">SMS Campaign "Spring Sale"</div>
                  <div className="text-gray-500 text-sm">Sent to 320 recipients</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm">2 hours ago</div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="text-green-600 text-sm">📞</div>
                </div>
                <div>
                  <div className="font-medium">Voice Call Campaign</div>
                  <div className="text-gray-500 text-sm">42 calls completed</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm">5 hours ago</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="text-purple-600 text-sm">💰</div>
                </div>
                <div>
                  <div className="font-medium">Payment Processed</div>
                  <div className="text-gray-500 text-sm">Stripe invoice #INV-7890</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm">Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}