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
      <div className="glass rounded-3xl p-10 border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
        <h1 className="text-4xl font-black text-white mb-4">Welcome back, {user.email?.split("@")[0]}</h1>
        <p className="text-xl text-gray-400">
          Your AI voice calling and SMS platform is running smoothly.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 bg-cyan-500/5">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Messages Sent</div>
          <div className="text-5xl font-black text-white mt-2">{stats.messagesSent.toLocaleString()}</div>
          <div className="text-cyan-400 text-sm mt-1">+12% from last month</div>
        </div>
        <div className="glass rounded-2xl p-6 border border-purple-500/20 bg-purple-500/5">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Response Rate</div>
          <div className="text-5xl font-black text-white mt-2">{stats.responseRate}</div>
          <div className="text-purple-400 text-sm mt-1">Industry average: 8%</div>
        </div>
        <div className="glass rounded-2xl p-6 border border-green-500/20 bg-green-500/5">
          <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Account Balance</div>
          <div className="text-5xl font-black text-white mt-2">${stats.balance.toLocaleString()}</div>
          <div className="text-green-400 text-sm mt-1">SMS credits available</div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Get Phone Number Card */}
        <div className="glass rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <div className="text-blue-400 font-bold text-lg mb-3">Get Phone Number</div>
          <p className="text-gray-400 text-sm mb-4">Buy a dedicated Twilio phone number</p>
          <button 
            onClick={() => router.push("/dashboard/numbers")}
            className="w-full bg-blue-500 text-black py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            Get Your Number
          </button>
        </div>
        
        <div className="glass rounded-2xl p-6 border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-cyan-500/10">
          <div className="text-cyan-400 font-bold text-lg mb-3">Start Campaign</div>
          <p className="text-gray-400 text-sm mb-4">Launch a new SMS or voice campaign</p>
          <button className="w-full bg-cyan-500 text-black py-3 rounded-xl font-bold hover:scale-105 transition">
            Create
          </button>
        </div>
        
        <div className="glass rounded-2xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
          <div className="text-purple-400 font-bold text-lg mb-3">View Analytics</div>
          <p className="text-gray-400 text-sm mb-4">Campaign performance and insights</p>
          <button 
            onClick={() => router.push("/dashboard/analytics")}
            className="w-full bg-purple-500 text-black py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            Analyze
          </button>
        </div>
        
        <div className="glass rounded-2xl p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/10">
          <div className="text-amber-400 font-bold text-lg mb-3">Support</div>
          <p className="text-gray-400 text-sm mb-4">Get help or submit a ticket</p>
          <button 
            onClick={() => router.push("/dashboard/support")}
            className="w-full bg-amber-500 text-black py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-black text-white">Recent Activity</h2>
          <p className="text-gray-400 text-sm mt-1">Last 24 hours of platform usage</p>
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
                  <div className="text-gray-500 text-sm">Payment processed successfully</div>
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