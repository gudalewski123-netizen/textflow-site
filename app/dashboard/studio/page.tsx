"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
}

interface ScriptUpload {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
  active: boolean;
}

interface Requirement {
  id: string;
  text: string;
  category: "behavior" | "response" | "restriction" | "custom";
}

export default function AIStudioPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I'm your AI agent. Let's customize how I should behave when talking to your customers. You can upload scripts, tell me requirements, and test conversations here.",
      timestamp: new Date(Date.now() - 3000),
    },
    {
      id: "2",
      role: "ai",
      content: "What business are you in? What kind of conversations should I handle?",
      timestamp: new Date(Date.now() - 2000),
    },
  ]);
  
  const [inputText, setInputText] = useState("");
  const [scriptUploads, setScriptUploads] = useState<ScriptUpload[]>([
    {
      id: "script1",
      name: "Welcome Flow - New Customers",
      content: "Welcome to [Business Name]! Thanks for reaching out. How can I help you get started today?",
      uploadedAt: new Date(Date.now() - 86400000),
      active: true,
    },
  ]);
  
  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: "req1",
      text: "Always be professional and friendly",
      category: "behavior",
    },
    {
      id: "req2",
      text: "Never discuss specific pricing without transferring to a human",
      category: "restriction",
    },
    {
      id: "req3",
      text: "For complaints, show empathy and escalate to support team",
      category: "response",
    },
  ]);

  const [newRequirement, setNewRequirement] = useState("");
  const [activeSection, setActiveSection] = useState<"chat" | "scripts" | "requirements">("chat");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: generateAIResponse(inputText),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("script") || lowerInput.includes("upload")) {
      return "You can upload scripts by clicking on the 'Scripts' tab. I'll use them as templates for conversations. Make sure to specify when each script should be used!";
    }
    
    if (lowerInput.includes("requirement") || lowerInput.includes("rule")) {
      return "Got it. I've added that requirement to my configuration. You can manage all requirements in the 'Requirements' tab. I'll follow these rules in all customer conversations.";
    }
    
    if (lowerInput.includes("test") || lowerInput.includes("conversation")) {
      return "Let's test! Pretend to be a customer and I'll respond based on your scripts and requirements. Try asking about pricing, support, or anything your customers might ask.";
    }
    
    if (lowerInput.includes("business") || lowerInput.includes("company")) {
      return "Understanding your business is key. Based on your scripts, I see you're focused on customer service. Tell me more about your industry or specific use cases.";
    }
    
    return "Thanks for sharing that. I'll incorporate this into how I respond to customers. Want to upload a specific script or add more requirements?";
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Create mock script uploads from files
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newScript: ScriptUpload = {
          id: `script-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          content: content.length > 500 ? content.substring(0, 500) + "..." : content,
          uploadedAt: new Date(),
          active: true,
        };
        setScriptUploads(prev => [...prev, newScript]);
      };
      reader.readAsText(file);
    });
  };

  const addRequirement = () => {
    if (!newRequirement.trim()) return;
    
    const newReq: Requirement = {
      id: `req-${Date.now()}`,
      text: newRequirement,
      category: "custom",
    };
    
    setRequirements(prev => [...prev, newReq]);
    setNewRequirement("");
    
    // Add system message
    const systemMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      role: "system",
      content: `New requirement added: "${newRequirement}"`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  const deleteRequirement = (id: string) => {
    setRequirements(prev => prev.filter(req => req.id !== id));
  };

  const toggleScriptActive = (id: string) => {
    setScriptUploads(prev => 
      prev.map(script => 
        script.id === id 
          ? { ...script, active: !script.active }
          : script
      )
    );
  };

  const activeScripts = scriptUploads.filter(s => s.active).length;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Agent Studio</h1>
            <p className="text-white/80 mt-2">
              Talk to your AI agent. Upload scripts. Set requirements. Customize behavior.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <div className="bg-gradient-to-r from-cyan-900/20 to-green-900/20 px-4 py-2 rounded-lg border border-green-500/30">
              <div className="text-sm text-gray-400">Active Scripts</div>
              <div className="text-xl font-bold text-white">{activeScripts}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 px-4 py-2 rounded-lg border border-purple-500/30">
              <div className="text-sm text-gray-400">Requirements</div>
              <div className="text-xl font-bold text-white">{requirements.length}</div>
            </div>
            <button
              onClick={() => router.push("/dashboard/messages")}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Go to Messages
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
        {/* Left sidebar - Navigation */}
        <div className="w-1/4 border-r border-white/10 bg-gray-900/30">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-bold text-white text-lg mb-3">Studio Sections</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection("chat")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === "chat"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">💬</span>
                  Chat with AI
                </div>
              </button>
              <button
                onClick={() => setActiveSection("scripts")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === "scripts"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">📄</span>
                  Script Uploads
                </div>
                {scriptUploads.length > 0 && (
                  <div className="ml-8 text-xs text-cyan-400 mt-1">
                    {scriptUploads.length} script(s)
                  </div>
                )}
              </button>
              <button
                onClick={() => setActiveSection("requirements")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === "requirements"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">📋</span>
                  Requirements
                </div>
                {requirements.length > 0 && (
                  <div className="ml-8 text-xs text-cyan-400 mt-1">
                    {requirements.length} rule(s)
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Agent Configuration */}
          <div className="p-4">
            <h3 className="font-bold text-white text-lg mb-3">Agent Profile</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Agent Name</label>
                <input
                  type="text"
                  defaultValue="Sales Assistant"
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Response Tone</label>
                <select className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white">
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Casual</option>
                  <option>Formal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Industry</label>
                <input
                  type="text"
                  placeholder="e.g., SaaS, E-commerce"
                  className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-white/10">
            <h3 className="font-bold text-white text-lg mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  // Clear chat but keep system messages
                  setMessages(prev => prev.filter(m => m.role === "system"));
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                Clear Chat History
              </button>
              <button
                onClick={() => {
                  // Export requirements as JSON
                  const dataStr = JSON.stringify(requirements, null, 2);
                  const dataBlob = new Blob([dataStr], { type: "application/json" });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "ai-agent-requirements.json";
                  link.click();
                }}
                className="w-full bg-cyan-600/30 hover:bg-cyan-700/30 text-cyan-400 px-3 py-2 rounded text-sm transition-colors"
              >
                Export Requirements
              </button>
              <button
                onClick={() => router.push("/dashboard/messages")}
                className="w-full bg-green-600/30 hover:bg-green-700/30 text-green-400 px-3 py-2 rounded text-sm transition-colors"
              >
                Test on Messages Page
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {activeSection === "chat" && (
            <>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-white"
                          : message.role === "ai"
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 text-white"
                          : "bg-gray-800/50 border border-gray-700 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-semibold">
                          {message.role === "user" ? "You" : 
                           message.role === "ai" ? "AI Agent" : 
                           "System"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </div>
                      </div>
                      <div className="text-white/90">{message.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-3">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Talk to your AI agent. Ask questions, give instructions, test responses..."
                    className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="self-end px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Send
                  </button>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <div>
                    The AI will learn from your conversations here and apply it to customer SMS.
                  </div>
                  <div>
                    Controls: <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for new line
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "scripts" && (
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Upload & Manage Scripts</h2>
                <p className="text-gray-400">
                  Upload conversation scripts that your AI agent will follow. Each script defines how to handle specific scenarios.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Area */}
                <div className="bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border-2 border-dashed border-cyan-500/30 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-colors">
                  <div className="text-cyan-400 text-4xl mb-4">📄</div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Script Files</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Upload .txt, .md, or .json files with conversation scripts, FAQs, or response templates.
                  </p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    multiple
                    accept=".txt,.md,.json,.csv"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Choose Files
                  </button>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    {uploadedFiles.length > 0 
                      ? `${uploadedFiles.length} file(s) ready to process`
                      : "No files selected"}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3">Script Guidelines</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      Use clear headings for different scenarios
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      Include example customer questions
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      Provide multiple response options
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      Specify when to escalate to human
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      Add context about your business
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-white mb-2">Sample Script Format:</h4>
                    <pre className="bg-black/50 text-xs text-gray-300 p-3 rounded-lg overflow-x-auto">
{`# Welcome New Customers
Customer says: "Hi, I'm interested"
AI responds: "Welcome! Thanks for reaching out. What specifically are you looking for today?"

# Pricing Questions
Customer asks: "How much does it cost?"
AI responds: "Our plans start at $99/month. Would you like me to send detailed pricing or schedule a demo?"`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Uploaded Scripts List */}
              {scriptUploads.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">Uploaded Scripts ({scriptUploads.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scriptUploads.map((script) => (
                      <div
                        key={script.id}
                        className={`bg-black/20 border rounded-xl p-4 hover:bg-black/30 transition-colors ${
                          script.active
                            ? "border-cyan-500/30"
                            : "border-gray-700/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white">{script.name}</h4>
                          <button
                            onClick={() => toggleScriptActive(script.id)}
                            className={`text-xs px-2 py-1 rounded ${
                              script.active
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {script.active ? "Active" : "Inactive"}
                          </button>
                        </div>
                        <div className="text-sm text-gray-400 mb-3">
                          Uploaded: {script.uploadedAt.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-white bg-black/30 p-2 rounded mt-2 whitespace-pre-line max-h-32 overflow-y-auto">
                          {script.content}
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded">
                            Edit
                          </button>
                          <button className="text-xs px-3 py-1 bg-cyan-600/30 hover:bg-cyan-700/30 text-cyan-400 rounded">
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "requirements" && (
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Define AI Requirements</h2>
                <p className="text-gray-400">
              These are rules your AI agent must follow in all customer conversations.
            </p>
              </div>

              {/* Add New Requirement */}
              <div className="mb-8 bg-gradient-to-r from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Add New Requirement</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Example: Always ask for customer name at start of conversation"
                    className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRequirement();
                      }
                    }}
                  />
                  <button
                    onClick={addRequirement}
                    disabled={!newRequirement.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Add Rule
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  Requirements control behavior, responses, restrictions, and custom rules.
                </div>
              </div>

              {/* Requirements List */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Current Requirements ({requirements.length})</h3>
                
                {requirements.length === 0 ? (
                  <div className="text-center py-12 bg-black/20 rounded-xl border border-white/10">
                    <div className="text-gray-400 text-4xl mb-4">📋</div>
                    <h4 className="text-lg font-bold text-white mb-2">No Requirements Yet</h4>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Add requirements to guide your AI agent's behavior. These rules will be applied to all customer conversations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requirements.map((req) => (
                      <div
                        key={req.id}
                        className="bg-black/20 border border-white/10 rounded-xl p-4 hover:bg-black/30 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <span className={`text-xs px-2 py-1 rounded-full mr-3 ${
                                req.category === "behavior"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : req.category === "response"
                                  ? "bg-green-500/20 text-green-400"
                                  : req.category === "restriction"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-purple-500/20 text-purple-400"
                              }`}>
                                {req.category.charAt(0).toUpperCase() + req.category.slice(1)}
                              </span>
                            </div>
                            <p className="text-white text-lg">{req.text}</p>
                          </div>
                          <button
                            onClick={() => deleteRequirement(req.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 ml-2"
                            title="Delete requirement"
                          >
                            ✗
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Legend */}
              <div className="mt-8 p-4 bg-black/30 rounded-xl border border-white/10">
                <h4 className="font-bold text-white mb-3">Requirement Categories</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Behavior</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Response</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Restriction</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Custom</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-cyan-900/10 to-blue-900/10 border border-cyan-500/20 rounded-xl p-4">
          <div className="text-sm text-gray-400">Agent Profile</div>
          <div className="text-xl font-bold text-white">Sales Assistant</div>
          <div className="text-xs text-cyan-400 mt-1">Professional Tone</div>
        </div>
        <div className="bg-gradient-to-r from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-xl p-4">
          <div className="text-sm text-gray-400">Active Scripts</div>
          <div className="text-xl font-bold text-white">{activeScripts}</div>
          <div className="text-xs text-purple-400 mt-1">{scriptUploads.length} total</div>
        </div>
        <div className="bg-gradient-to-r from-green-900/10 to-emerald-900/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-sm text-gray-400">Requirements</div>
          <div className="text-xl font-bold text-white">{requirements.length}</div>
          <div className="text-xs text-green-400 mt-1">Rules active</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-900/10 to-orange-900/10 border border-orange-500/20 rounded-xl p-4">
          <div className="text-sm text-gray-400">AI Status</div>
          <div className="text-xl font-bold text-white">Ready</div>
          <div className="text-xs text-yellow-400 mt-1">DeepSeek v3.1</div>
        </div>
      </div>
    </div>
  );
}