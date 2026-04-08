"use client";

export default function DashboardPage() {
  return (
    <div className="space-y-8 text-white">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold">TextFlow Dashboard</h1>
        <p className="text-blue-100 mt-2">AI-powered SMS & voice platform</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Balance & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Account Balance */}
          <div className="bg-gray-800 border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-4">Account Balance</h2>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-4xl font-bold text-white">$2,450.75</div>
                <div className="text-gray-300 mt-1">Twilio SMS credits available</div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Add Credits
              </button>
            </div>
            <div className="text-sm text-gray-300">
              💰 SMS cost: $0.0105 per message • 33% margin on Twilio
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-xl p-5">
                <div className="text-blue-600 font-bold mb-2">📱 Send SMS</div>
                <p className="text-gray-400 text-sm mb-4">Send message to contacts</p>
                <textarea className="w-full h-20 border rounded-lg p-3 text-sm mb-3" placeholder="Message..." />
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Send</button>
              </div>
              <div className="border rounded-xl p-5">
                <div className="text-green-600 font-bold mb-2">📄 Upload CSV</div>
                <p className="text-gray-400 text-sm mb-4">Import leads for campaigns</p>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <div className="text-gray-400 mb-2">Drop CSV file here</div>
                  <button className="text-blue-600 text-sm">or click to browse</button>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Activity */}
          <div className="bg-gray-800 border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-6">Today's Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1,520</div>
                <div className="text-gray-300 text-sm">Messages Sent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">217</div>
                <div className="text-gray-300 text-sm">Responses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">$15.96</div>
                <div className="text-gray-300 text-sm">Cost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">14.3%</div>
                <div className="text-gray-300 text-sm">Response Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Calendar & Recent */}
        <div className="space-y-8">
          {/* Calendar Box */}
          <div className="bg-gray-800 border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Sales Call - John Smith</div>
                  <div className="text-gray-300 text-sm">Today, 3:00 PM</div>
                </div>
                <div className="text-blue-600">📅</div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Follow-up - Sarah Johnson</div>
                  <div className="text-gray-300 text-sm">Tomorrow, 11:00 AM</div>
                </div>
                <div className="text-blue-600">📅</div>
              </div>
              <button className="w-full border-2 border-dashed border-gray-600 rounded-lg p-3 text-gray-300 hover:border-blue-300">
                + Add meeting (AI will create most)
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">CSV uploaded - 450 leads</div>
                <div className="text-gray-300">10 minutes ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">SMS campaign started</div>
                <div className="text-gray-300">45 minutes ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Payment processed</div>
                <div className="text-gray-300">2 hours ago</div>
              </div>
            </div>
          </div>

          {/* Text Message Inbox */}
          <div className="bg-gray-800 border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-4">Recent Messages</h2>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">+1 (555) 012-3456</span>
                  <span className="text-gray-300 text-sm">2:14 PM</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">Yes, I'm interested in the spring sale!</p>
                <input className="w-full border rounded px-3 py-1 text-sm" placeholder="Reply..." />
              </div>
              <div className="border rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">+1 (555) 987-6543</span>
                  <span className="text-gray-300 text-sm">1:30 PM</span>
                </div>
                <p className="text-gray-300 text-sm">What time is the appointment?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-gray-300 text-sm pt-4 border-t">
        TextFlow AI • $125/month platform • $0.0105/SMS • $50 setup fee
      </div>
    </div>
  );
}