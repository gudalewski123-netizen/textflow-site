'use client';

import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User | null;
  onSignOut: () => void;
  stats: {
    messagesSent: number;
    responseRate: string;
    balance: number;
  };
}

export default function DashboardHeader({ user, onSignOut, stats }: DashboardHeaderProps) {
  return (
    <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold text-white">TextFlow AI</span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button className="text-white font-semibold px-3 py-2 rounded-lg bg-blue-900/50 border border-blue-700">
                Dashboard
              </button>
              <button className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                Calendar
              </button>
              <button className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                Contact Support
              </button>
            </nav>
          </div>

          {/* Stats & User Info */}
          <div className="flex items-center space-x-6">
            {/* Quick Stats */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-right">
                <div className="text-xs text-gray-400">Messages</div>
                <div className="text-white font-semibold">{stats.messagesSent.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Response Rate</div>
                <div className="text-green-400 font-semibold">{stats.responseRate}</div>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-white">{user?.email || 'User'}</div>
                <div className="text-xs text-gray-400">Enterprise Account</div>
              </div>
              <div className="relative">
                <button
                  onClick={onSignOut}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}