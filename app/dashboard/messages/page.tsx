"use client";

import { useState } from "react";

// Mock data for layout preview
const mockConversations = [
  { id: 1, name: "John Doe", phone: "+1 (555) 123-4567", lastMessage: "Hey, when will my order ship?", timestamp: "10:30 AM", unread: 3 },
  { id: 2, name: "Sarah Smith", phone: "+1 (555) 987-6543", lastMessage: "Thanks for the quick response!", timestamp: "Yesterday", unread: 0 },
  { id: 3, name: "Alex Johnson", phone: "+1 (555) 456-7890", lastMessage: "Can you help me with setup?", timestamp: "2 days ago", unread: 1 },
  { id: 4, name: "Business Inquiry", phone: "+1 (555) 222-3333", lastMessage: "Interested in enterprise pricing", timestamp: "3 days ago", unread: 0 },
];

const mockMessages = [
  { id: 1, sender: "customer", content: "Hey, when will my order ship?", timestamp: "10:29 AM" },
  { id: 2, sender: "ai", content: "Hi! Your order is scheduled to ship tomorrow morning. You'll receive tracking info by email.", timestamp: "10:30 AM", aiGenerated: true },
  { id: 3, sender: "customer", content: "Great, thanks! Can I upgrade to express shipping?", timestamp: "10:31 AM" },
  { id: 4, sender: "ai", content: "Absolutely! I can help with that. It would be an additional $15. Would you like me to proceed?", timestamp: "10:32 AM", aiGenerated: true },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-white/80 mt-2">
          AI-powered SMS conversations - AI handles everything automatically
        </p>
      </div>

      <div className="flex-1 flex bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-1/3 border-r border-white/10">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-280px)]">
            {mockConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                  selectedConversation === conv.id ? "bg-cyan-900/20" : "hover:bg-white/5"
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-white">{conv.name}</div>
                    <div className="text-sm text-gray-400">{conv.phone}</div>
                  </div>
                  <div className="text-xs text-gray-500">{conv.timestamp}</div>
                </div>
                <div className="mt-2 text-sm text-gray-300 truncate">{conv.lastMessage}</div>
                {conv.unread > 0 && (
                  <div className="mt-2 inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-black text-xs font-bold rounded-full">
                    {conv.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 flex flex-col">
          {/* Conversation header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-lg">
                  {mockConversations.find(c => c.id === selectedConversation)?.name}
                </div>
                <div className="text-sm text-gray-400">
                  {mockConversations.find(c => c.id === selectedConversation)?.phone}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors">
                  New Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-black/10 to-transparent">
            <div className="space-y-4">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "customer" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.sender === "customer"
                        ? "bg-white/10 text-white"
                        : "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold">
                        {msg.sender === "customer" ? "Customer" : "AI Assistant"}
                      </div>
                      {msg.aiGenerated && (
                        <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-full">
                          AI Auto-reply
                        </span>
                      )}
                    </div>
                    <div className="text-white/90">{msg.content}</div>
                    <div className="text-xs text-gray-400 mt-2">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Status - No reply input needed */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-green-900/20 to-cyan-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <div className="text-green-400 font-bold">AI Assistant Active</div>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  AI is automatically handling this conversation. All replies are AI-generated.
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Mode</div>
                <div className="text-lg font-bold text-white">Full Automation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4">
          <div className="text-sm text-gray-400">Active Conversations</div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4">
          <div className="text-sm text-gray-400">AI Replies Today</div>
          <div className="text-2xl font-bold text-white">47</div>
        </div>
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4">
          <div className="text-sm text-gray-400">Avg Response Time</div>
          <div className="text-2xl font-bold text-white">2.3m</div>
        </div>
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4">
          <div className="text-sm text-gray-400">Campaigns Active</div>
          <div className="text-2xl font-bold text-white">3</div>
        </div>
        <div className="bg-gradient-to-r from-green-900/20 to-green-600/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">Twilio Credits</div>
              <div className="text-2xl font-bold text-white">$245.75</div>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Add Funds
            </button>
          </div>
          <div className="mt-2 text-xs text-green-400">• Enough for ~4,915 SMS</div>
          <div className="mt-1 text-xs text-gray-400">• Enough for ~1,230 voice minutes</div>
        </div>
      </div>
      
      {/* Twilio Account Section */}
      <div className="mt-6 glass rounded-2xl border border-cyan-500/20 p-6 bg-gradient-to-r from-cyan-900/10 to-blue-900/10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Twilio Account</h3>
            <p className="text-gray-400 text-sm">Manage your SMS/voice integration</p>
          </div>
          <div className="space-x-3">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium">
              Purchase Number
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium border border-white/30">
              View Billing
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Account SID</div>
            <div className="text-white font-mono text-sm truncate">AC1234567890abcdef... (Click to copy)</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">Phone Numbers</div>
            <div className="text-white font-bold text-lg">2 Numbers</div>
            <div className="text-gray-400 text-sm mt-1">+1 (555) 123-4567 • +1 (555) 987-6543</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400">SMS Sent Today</div>
            <div className="text-white font-bold text-lg">152 SMS</div>
            <div className="text-gray-400 text-sm mt-1">Cost: ~$0.45 today</div>
          </div>
        </div>
      </div>
    </div>
  );
}