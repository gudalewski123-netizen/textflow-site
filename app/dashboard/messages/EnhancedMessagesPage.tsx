"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface Conversation {
  id: number;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  aiEnabled: boolean;
}

interface Message {
  id: number;
  sender: "customer" | "ai" | "user";
  content: string;
  timestamp: string;
  aiGenerated?: boolean;
  status?: "delivered" | "failed" | "pending";
}

interface AIStatus {
  enabled: boolean;
  provider: string;
  realAI: boolean;
  lastResponseTime?: number;
}

export default function EnhancedMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [aiStatus, setAiStatus] = useState<AIStatus>({
    enabled: false,
    provider: "deepseek",
    realAI: false,
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [areaCode, setAreaCode] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  // Mock data
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, name: "John Doe", phone: "+1 (555) 123-4567", lastMessage: "Hey, when will my order ship?", timestamp: "10:30 AM", unread: 3, aiEnabled: true },
    { id: 2, name: "Sarah Smith", phone: "+1 (555) 987-6543", lastMessage: "Thanks for the quick response!", timestamp: "Yesterday", unread: 0, aiEnabled: true },
    { id: 3, name: "Alex Johnson", phone: "+1 (555) 456-7890", lastMessage: "Can you help me with setup?", timestamp: "2 days ago", unread: 1, aiEnabled: false },
    { id: 4, name: "Business Inquiry", phone: "+1 (555) 222-3333", lastMessage: "Interested in enterprise pricing", timestamp: "3 days ago", unread: 0, aiEnabled: true },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "customer", content: "Hey, when will my order ship?", timestamp: "10:29 AM" },
    { id: 2, sender: "ai", content: "Hi! Your order is scheduled to ship tomorrow morning. You'll receive tracking info by email.", timestamp: "10:30 AM", aiGenerated: true },
    { id: 3, sender: "customer", content: "Great, thanks! Can I upgrade to express shipping?", timestamp: "10:31 AM" },
    { id: 4, sender: "ai", content: "Absolutely! I can help with that. It would be an additional $15. Would you like me to proceed?", timestamp: "10:32 AM", aiGenerated: true },
  ]);

  useEffect(() => {
    // Check AI status on load
    checkAIStatus();
    
    // Get current user ID and balance
    const getUser = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Fetch client balance and phone number
        const res = await fetch(`/api/client/account?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setBalance(data.data.balance || 0);
            setPhoneNumber(data.data.phone_number || '');
          }
        }
      }
    };
    getUser();
  }, []);

  const checkAIStatus = async () => {
    try {
      const res = await fetch("/api/ai/sms");
      if (res.ok) {
        const data = await res.json();
        setAiStatus({
          enabled: data.aiEnabled,
          provider: data.defaultProvider || "deepseek",
          realAI: data.aiEnabled,
        });
      }
    } catch (error) {
      console.error("Failed to check AI status:", error);
    }
  };
  
  const purchaseNumber = async () => {
    if (!areaCode || areaCode.length !== 3) return;
    
    setPurchasing(true);
    
    try {
      const response = await fetch('/api/client/numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaCode,
          clientId: userId
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Success! Update local state
        setPhoneNumber(data.data.phoneNumber);
        setShowPurchaseModal(false);
        // Refresh balance
        if (userId) {
          const res = await fetch(`/api/client/account?userId=${userId}`);
          if (res.ok) {
            const accountData = await res.json();
            if (accountData.success && accountData.data) {
              setBalance(accountData.data.balance || 0);
            }
          }
        }
      } else {
        alert(data.message || 'Failed to purchase number');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to purchase number');
    } finally {
      setPurchasing(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: newMessage,
      timestamp: "Just now",
      status: "pending",
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    try {
      // Send via Twilio API
      const twilioRes = await fetch("/api/twilio/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: conversations.find(c => c.id === selectedConversation)?.phone,
          body: newMessage,
          clientId: userId,
        }),
      });

      if (twilioRes.ok) {
        // Update message status
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: "delivered", timestamp: "Just now ✓" }
              : msg
          )
        );
      } else {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: "failed", timestamp: "Failed to send" }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: "failed", timestamp: "Failed to send" }
            : msg
        )
      );
    }

    setSendingMessage(false);
  };

  const generateAIResponse = async () => {
    const lastCustomerMessage = messages
      .filter(m => m.sender === "customer")
      .pop()?.content;

    if (!lastCustomerMessage) return;

    try {
      const res = await fetch("/api/ai/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incomingMessage: lastCustomerMessage,
          businessContext: "TextFlow AI - SMS Platform",
          tone: "professional",
          provider: "deepseek",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        const aiMessage: Message = {
          id: messages.length + 1,
          sender: "ai",
          content: data.response,
          timestamp: "Just now",
          aiGenerated: true,
        };

        setMessages(prev => [...prev, aiMessage]);

        // Also send via Twilio if auto-reply is enabled
        if (aiAutoReply) {
          const currentConversation = conversations.find(c => c.id === selectedConversation);
          if (currentConversation) {
            await fetch("/api/twilio/sms", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: currentConversation.phone,
                body: data.response,
              }),
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate AI response:", error);
    }
  };

  const toggleAIForConversation = (conversationId: number) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, aiEnabled: !conv.aiEnabled }
          : conv
      )
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <p className="text-white/80 mt-2">
              AI-powered SMS conversations with Twilio & DeepSeek integration
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              aiStatus.enabled 
                ? "bg-green-500/20 text-green-400" 
                : "bg-yellow-500/20 text-yellow-400"
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${aiStatus.enabled ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className="font-medium">
                {aiStatus.enabled ? "AI Active" : "AI Mock Mode"}
              </span>
            </div>
            <button
              onClick={() => window.location.href = "/dashboard/integrations"}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Configure Integrations
            </button>
          </div>
        </div>
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
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {conversations.length} conversations
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={aiAutoReply}
                    onChange={(e) => setAiAutoReply(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    aiAutoReply ? "bg-cyan-600" : "bg-gray-700"
                  }`}>
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                      aiAutoReply ? "translate-x-7" : "translate-x-1"
                    } mt-0.5`}></div>
                  </div>
                </div>
                <span className="text-sm text-white">AI Auto-reply</span>
              </label>
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-280px)]">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                  selectedConversation === conv.id ? "bg-cyan-900/20" : "hover:bg-white/5"
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white">{conv.name}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAIForConversation(conv.id);
                        }}
                        className={`text-xs px-2 py-1 rounded-full ${
                          conv.aiEnabled
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {conv.aiEnabled ? "🤖 AI On" : "AI Off"}
                      </button>
                    </div>
                    <div className="text-sm text-gray-400">{conv.phone}</div>
                  </div>
                  <div className="text-xs text-gray-500 ml-2">{conv.timestamp}</div>
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
                  {conversations.find(c => c.id === selectedConversation)?.name}
                </div>
                <div className="text-sm text-gray-400">
                  {conversations.find(c => c.id === selectedConversation)?.phone}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={generateAIResponse}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Generate AI Reply
                </button>
                <button className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors">
                  New Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-black/10 to-transparent">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "customer" ? "justify-start" : msg.sender === "ai" ? "justify-end" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.sender === "customer"
                        ? "bg-white/10 text-white"
                        : msg.sender === "ai"
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 text-white"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold">
                        {msg.sender === "customer" ? "Customer" : msg.sender === "ai" ? "AI Assistant" : "You"}
                      </div>
                      {msg.aiGenerated && (
                        <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">
                          AI Generated
                        </span>
                      )}
                      {msg.status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          msg.status === "delivered" ? "bg-green-500/30 text-green-300" :
                          msg.status === "failed" ? "bg-red-500/30 text-red-300" :
                          "bg-yellow-500/30 text-yellow-300"
                        }`}>
                          {msg.status === "delivered" ? "✓ Delivered" :
                           msg.status === "failed" ? "✗ Failed" : "↻ Sending"}
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

          {/* AI Status Bar */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-green-900/20 to-cyan-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${aiStatus.enabled ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}></div>
                  <div className={`font-bold ${aiStatus.enabled ? "text-green-400" : "text-yellow-400"}`}>
                    {aiStatus.enabled ? "AI Assistant Active" : "AI Mock Mode Active"}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {aiStatus.enabled 
                    ? `Using ${aiStatus.provider} for AI responses. ${aiStatus.realAI ? "Real AI enabled." : "Using mock responses."}`
                    : "Set API keys in Integrations for real AI responses."}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Integration</div>
                <div className="text-lg font-bold text-white">
                  Twilio + DeepSeek
                </div>
              </div>
            </div>
          </div>

          {/* Billing Status Bar */}
          <div className="p-4 border-t border-white/10 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <div className="text-cyan-400 mr-2">💰</div>
                  <div className="font-bold text-white">
                    Balance: ${balance.toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Cost per SMS: $0.0189
                </div>
              </div>
              
              <div className="text-right">
                {phoneNumber ? (
                  <>
                    <div className="text-sm text-gray-400">Your Number</div>
                    <div className="text-lg font-bold text-green-400">
                      {phoneNumber}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Get Phone Number
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="self-end px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {sendingMessage ? "Sending..." : "Send SMS"}
              </button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <div>
                SMS via <span className="text-cyan-400">Twilio</span> • Cost: <span className="text-white">$0.0189</span>
              </div>
              <div>
                Characters: <span className="text-white">{newMessage.length}/160</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status Footer */}
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
          <div className="text-sm text-gray-400">Twilio Balance</div>
          <div className="text-2xl font-bold text-white">$245.75</div>
          <div className="text-xs text-gray-400 mt-1">~4,915 SMS remaining</div>
        </div>
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">AI Provider</div>
              <div className="text-2xl font-bold text-white">{aiStatus.provider}</div>
            </div>
            <div className={`w-3 h-3 rounded-full ${aiStatus.enabled ? "bg-green-500" : "bg-yellow-500"}`}></div>
          </div>
          <div className="mt-2 text-xs text-purple-400">
            {aiStatus.realAI ? "• Real AI enabled" : "• Mock mode active"}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {aiStatus.enabled ? "• API key configured" : "• Set API key in Integrations"}
          </div>
        </div>
      </div>

      {/* Purchase Phone Number Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Purchase Phone Number</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <div className="text-yellow-400 text-sm font-bold">$2.00 one-time fee</div>
                <div className="text-gray-400 text-xs mt-1">Includes your first month</div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Area Code</label>
                <input
                  type="text"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="e.g., 415"
                  className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400"
                />
                <div className="text-xs text-gray-400 mt-1">3-digit area code</div>
              </div>
              
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-sm text-gray-400">Your number will be:</div>
                <div className="text-white font-bold">
                  +1{areaCode || 'XXX'}XXXXXXX
                </div>
              </div>
              
              <button
                onClick={purchaseNumber}
                disabled={!areaCode || areaCode.length !== 3 || purchasing}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {purchasing ? 'Purchasing...' : 'Purchase Number - $2.00'}
              </button>
              
              <div className="text-xs text-gray-400 text-center">
                You'll be charged $2.00 now and $2.00/month ongoing
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}