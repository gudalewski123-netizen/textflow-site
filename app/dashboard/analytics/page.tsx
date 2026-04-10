"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-700 text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Campaign Analytics</h1>
        <p className="text-gray-400 mt-2">Performance metrics and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 bg-cyan-500/5">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Active Campaigns</div>
          <div className="text-5xl font-black text-white mt-2">8</div>
          <div className="text-cyan-400 text-sm mt-1">3 completed this week</div>
        </div>
        <div className="glass rounded-2xl p-6 border border-purple-500/20 bg-purple-500/5">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Total Engagement</div>
          <div className="text-5xl font-black text-white mt-2">14.3%</div>
          <div className="text-purple-400 text-sm mt-1">+2.1% vs last month</div>
        </div>
        <div className="glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Conversion Rate</div>
          <div className="text-5xl font-black text-white mt-2">6.8%</div>
          <div className="text-green-400 text-sm mt-1">Above industry average</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold mb-4">Messages Over Time</h3>
          <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">📊 Chart: Messages sent per day</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold mb-4">Response Rate Trends</h3>
          <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">📈 Chart: Response rates by campaign</p>
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="glass rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700/30">
          <h3 className="text-xl font-bold">Campaign Performance</h3>
          <p className="text-gray-400 text-sm mt-1">Detailed metrics for each campaign</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Sample Campaign Rows */}
            <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
              <div>
                <h4 className="font-medium">Spring Sale Campaign</h4>
                <p className="text-gray-400 text-sm">SMS • 2,840 recipients</p>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">14.7% response</div>
                <p className="text-gray-400 text-sm">Completed: Apr 5</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
              <div>
                <h4 className="font-medium">Q1 Follow-up</h4>
                <p className="text-gray-400 text-sm">Voice • 850 calls</p>
              </div>
              <div className="text-right">
                <div className="text-blue-400 font-bold">8.2% response</div>
                <p className="text-gray-400 text-sm">Active: Ends Apr 15</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium">Welcome Series</h4>
                <p className="text-gray-400 text-sm">SMS • 1,200 recipients</p>
              </div>
              <div className="text-right">
                <div className="text-purple-400 font-bold">21.3% response</div>
                <p className="text-gray-400 text-sm">Active: Ongoing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="flex justify-center">
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium">
          📥 Export Analytics Report
        </button>
      </div>
    </div>
  );
}