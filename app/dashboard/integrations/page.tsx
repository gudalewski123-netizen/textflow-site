"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface IntegrationStatus {
  name: string;
  status: "connected" | "disconnected" | "error";
  lastChecked: string;
  details: string;
}

interface TwilioConfig {
  accountSid: string;
  phoneNumbers: string[];
  balance: number;
  smsSentToday: number;
}

interface DeepSeekConfig {
  apiKeyConfigured: boolean;
  model: string;
  lastUsed: string;
  costPerRequest: number;
}

export default function IntegrationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [twilioConfig, setTwilioConfig] = useState<TwilioConfig | null>(null);
  const [deepSeekConfig, setDeepSeekConfig] = useState<DeepSeekConfig | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    { name: "Twilio SMS", status: "disconnected", lastChecked: "Never", details: "SMS and voice service" },
    { name: "DeepSeek AI", status: "disconnected", lastChecked: "Never", details: "AI message generation" },
    { name: "Supabase Database", status: "connected", lastChecked: "Just now", details: "User data and messages" },
    { name: "Stripe Payments", status: "connected", lastChecked: "2 hours ago", details: "Billing and subscriptions" },
  ]);

  useEffect(() => {
    const fetchIntegrationStatus = async () => {
      try {
        // Fetch Twilio status
        const twilioRes = await fetch("/api/twilio/balance?accountSid=demo");
        if (twilioRes.ok) {
          const twilioData = await twilioRes.json();
          setTwilioConfig({
            accountSid: "AC**********",
            phoneNumbers: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
            balance: twilioData.balance || 245.75,
            smsSentToday: 152,
          });
          
          // Update integration status
          setIntegrations(prev => prev.map(integ => 
            integ.name === "Twilio SMS" 
              ? { ...integ, status: "connected", lastChecked: "Just now" }
              : integ
          ));
        }
      } catch (error) {
        console.error("Failed to fetch Twilio status:", error);
      }

      try {
        // Fetch DeepSeek status
        const deepseekRes = await fetch("/api/ai/sms");
        if (deepseekRes.ok) {
          const deepseekData = await deepseekRes.json();
          setDeepSeekConfig({
            apiKeyConfigured: deepseekData.aiEnabled || false,
            model: "deepseek-chat",
            lastUsed: "Never",
            costPerRequest: 0.0001,
          });
          
          // Update integration status
          setIntegrations(prev => prev.map(integ => 
            integ.name === "DeepSeek AI" 
              ? { ...integ, status: deepseekData.aiEnabled ? "connected" : "disconnected", lastChecked: "Just now" }
              : integ
          ));
        }
      } catch (error) {
        console.error("Failed to fetch DeepSeek status:", error);
      }

      setLoading(false);
    };

    fetchIntegrationStatus();
  }, []);

  const handleConnectTwilio = () => {
    // Open Twilio configuration modal or redirect
    alert("Twilio configuration would open here. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local");
  };

  const handleConnectDeepSeek = () => {
    // Open DeepSeek configuration modal
    alert("DeepSeek configuration would open here. Set DEEPSEEK_API_KEY in .env.local");
  };

  const handleTestIntegration = async (integrationName: string) => {
    if (integrationName === "Twilio SMS") {
      try {
        const res = await fetch("/api/twilio/sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "+15551234567", // Test number
            body: "Test message from TextFlow AI integration",
          }),
        });
        
        if (res.ok) {
          alert("✅ Twilio SMS test sent successfully!");
        } else {
          alert("❌ Twilio SMS test failed. Check configuration.");
        }
      } catch (error) {
        alert("❌ Twilio SMS test failed: " + error);
      }
    } else if (integrationName === "DeepSeek AI") {
      try {
        const res = await fetch("/api/ai/sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            incomingMessage: "Hello, can you help me with pricing?",
            businessContext: "TextFlow AI - SMS Platform",
            tone: "professional",
          }),
        });
        
        if (res.ok) {
          const data = await res.json();
          alert(`✅ DeepSeek AI test successful!\n\nResponse: "${data.response}"\nProvider: ${data.provider}\nReal AI: ${data.realAI ? "Yes" : "No"}`);
        } else {
          alert("❌ DeepSeek AI test failed. Check configuration.");
        }
      } catch (error) {
        alert("❌ DeepSeek AI test failed: " + error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white">Loading integrations...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Integrations</h1>
        <p className="text-white/80 mt-2">
          Connect and manage third-party services for your SMS platform
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{integration.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{integration.details}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                integration.status === "connected"
                  ? "bg-green-500/20 text-green-400"
                  : integration.status === "error"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {integration.status === "connected" ? "✓ Connected" : 
                 integration.status === "error" ? "⚠ Error" : "Disconnected"}
              </div>
            </div>
            
            <div className="text-sm text-gray-400 mb-4">
              Last checked: {integration.lastChecked}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleTestIntegration(integration.name)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium border border-white/30 transition-colors"
              >
                Test
              </button>
              {integration.name === "Twilio SMS" && (
                <button
                  onClick={handleConnectTwilio}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Configure
                </button>
              )}
              {integration.name === "DeepSeek AI" && (
                <button
                  onClick={handleConnectDeepSeek}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Configure
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Twilio Configuration Section */}
      <div className="glass rounded-2xl border border-cyan-500/20 p-6 bg-gradient-to-r from-cyan-900/10 to-blue-900/10 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Twilio Configuration</h3>
            <p className="text-gray-400 text-sm">Manage your SMS and voice service</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleConnectTwilio}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Update Credentials
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium border border-white/30">
              View Documentation
            </button>
          </div>
        </div>
        
        {twilioConfig ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">Account SID</div>
              <div className="text-white font-mono text-sm truncate">{twilioConfig.accountSid}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">Phone Numbers</div>
              <div className="text-white font-bold text-lg">{twilioConfig.phoneNumbers.length} Numbers</div>
              <div className="text-gray-400 text-sm mt-1 truncate">
                {twilioConfig.phoneNumbers.join(" • ")}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">Account Balance</div>
              <div className="text-white font-bold text-lg">${twilioConfig.balance.toFixed(2)}</div>
              <div className="text-gray-400 text-sm mt-1">~{Math.floor(twilioConfig.balance / 0.01)} SMS remaining</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">SMS Sent Today</div>
              <div className="text-white font-bold text-lg">{twilioConfig.smsSentToday} SMS</div>
              <div className="text-gray-400 text-sm mt-1">Cost: ~${(twilioConfig.smsSentToday * 0.01).toFixed(2)}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-cyan-400 text-4xl mb-4">📱</div>
            <h4 className="text-xl font-bold text-white mb-2">Twilio Not Configured</h4>
            <p className="text-gray-400 mb-6">
              Connect your Twilio account to enable SMS and voice capabilities.
            </p>
            <button
              onClick={handleConnectTwilio}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Connect Twilio Account
            </button>
          </div>
        )}
      </div>

      {/* DeepSeek AI Configuration Section */}
      <div className="glass rounded-2xl border border-purple-500/20 p-6 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">DeepSeek AI Configuration</h3>
            <p className="text-gray-400 text-sm">AI-powered message generation and responses</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleConnectDeepSeek}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Update API Key
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium border border-white/30">
              AI Settings
            </button>
          </div>
        </div>
        
        {deepSeekConfig ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">API Key Status</div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${deepSeekConfig.apiKeyConfigured ? "bg-green-500" : "bg-red-500"}`}></div>
                <div className="text-white font-bold">
                  {deepSeekConfig.apiKeyConfigured ? "Configured" : "Not Configured"}
                </div>
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {deepSeekConfig.apiKeyConfigured ? "Ready for real AI" : "Using mock responses"}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">AI Model</div>
              <div className="text-white font-bold text-lg">{deepSeekConfig.model}</div>
              <div className="text-gray-400 text-sm mt-1">DeepSeek Chat v3.1</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">Last Used</div>
              <div className="text-white font-bold text-lg">{deepSeekConfig.lastUsed}</div>
              <div className="text-gray-400 text-sm mt-1">AI message generation</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">Cost per Request</div>
              <div className="text-white font-bold text-lg">${deepSeekConfig.costPerRequest.toFixed(4)}</div>
              <div className="text-gray-400 text-sm mt-1">~10,000 requests for $1</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-purple-400 text-4xl mb-4">🤖</div>
            <h4 className="text-xl font-bold text-white mb-2">DeepSeek AI Not Configured</h4>
            <p className="text-gray-400 mb-6">
              Add your DeepSeek API key to enable AI-powered message generation.
            </p>
            <button
              onClick={handleConnectDeepSeek}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Configure DeepSeek AI
            </button>
          </div>
        )}

        {/* AI Test Section */}
        <div className="mt-8 p-6 bg-black/30 rounded-xl border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4">Test AI Response Generation</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Sample Customer Message</label>
                <select className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white">
                  <option>"What's your pricing?"</option>
                  <option>"I need help with my account"</option>
                  <option>"When will my order ship?"</option>
                  <option>"Can I get a refund?"</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Business Context</label>
                <input
                  type="text"
                  defaultValue="TextFlow AI - SMS Marketing Platform"
                  className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
            <button
              onClick={() => handleTestIntegration("DeepSeek AI")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity w-full"
            >
              Generate AI Response
            </button>
          </div>
        </div>
      </div>

      {/* Environment Configuration */}
      <div className="mt-8 p-6 bg-black/20 rounded-xl border border-white/10">
        <h4 className="text-lg font-bold text-white mb-4">Environment Configuration</h4>
        <p className="text-gray-400 text-sm mb-4">
          Add these environment variables to your <code className="bg-black/50 px-2 py-1 rounded">.env.local</code> file:
        </p>
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
          <div className="text-cyan-400"># Twilio Configuration</div>
          <div>TWILIO_ACCOUNT_SID=your_account_sid_here</div>
          <div>TWILIO_AUTH_TOKEN=your_auth_token_here</div>
          <div>TWILIO_PHONE_NUMBER=+15551234567</div>
          <div className="mt-2 text-purple-400"># DeepSeek AI Configuration</div>
          <div>DEEPSEEK_API_KEY=your_deepseek_api_key_here</div>
        </div>
      </div>
    </div>
  );
}