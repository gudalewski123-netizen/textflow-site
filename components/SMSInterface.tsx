'use client';

import { useState, useEffect } from 'react';

interface SMSMessage {
  id: number;
  type: 'sent' | 'received';
  phoneNumber: string;
  contactName?: string;
  message: string;
  timestamp: string;
  status?: 'delivered' | 'failed' | 'pending';
}

const mockMessages: SMSMessage[] = [
  {
    id: 1,
    type: 'sent',
    phoneNumber: '+1 (555) 123-4567',
    contactName: 'John Smith',
    message: 'Hi John, following up on our Q2 proposal. Are you available for a call tomorrow?',
    timestamp: '10:30 AM',
    status: 'delivered'
  },
  {
    id: 2,
    type: 'received',
    phoneNumber: '+1 (555) 123-4567',
    contactName: 'John Smith',
    message: 'Yes, I can do 2 PM tomorrow. Please send calendar invite.',
    timestamp: '10:35 AM',
    status: 'delivered'
  },
  {
    id: 3,
    type: 'sent',
    phoneNumber: '+1 (555) 987-6543',
    message: 'Welcome to TextFlow AI! Your account is now active. Download our mobile app for notifications.',
    timestamp: '9:15 AM',
    status: 'delivered'
  },
  {
    id: 4,
    type: 'received',
    phoneNumber: '+1 (555) 234-5678',
    contactName: 'Sarah Wilson',
    message: 'The demo was great! Can we schedule implementation next week?',
    timestamp: 'Yesterday, 3:45 PM',
    status: 'delivered'
  },
  {
    id: 5,
    type: 'sent',
    phoneNumber: '+1 (555) 234-5678',
    contactName: 'Sarah Wilson',
    message: 'Absolutely! I\'ll have our team reach out Monday morning.',
    timestamp: 'Yesterday, 4:20 PM',
    status: 'delivered'
  }
];

export default function SMSInterface() {
  const [messages, setMessages] = useState<SMSMessage[]>(mockMessages);
  const [selectedConversation, setSelectedConversation] = useState<string>('+1 (555) 123-4567');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Group messages by phone number
  const conversations = messages.reduce((acc, msg) => {
    if (!acc[msg.phoneNumber]) {
      acc[msg.phoneNumber] = {
        phoneNumber: msg.phoneNumber,
        contactName: msg.contactName,
        lastMessage: msg.message,
        lastTime: msg.timestamp,
        unread: msg.type === 'received',
        count: 1
      };
    } else {
      acc[msg.phoneNumber].lastMessage = msg.message;
      acc[msg.phoneNumber].lastTime = msg.timestamp;
      if (msg.type === 'received') acc[msg.phoneNumber].unread = true;
      acc[msg.phoneNumber].count++;
    }
    return acc;
  }, {} as Record<string, any>);

  const conversationList = Object.values(conversations);

  const currentMessages = messages.filter(msg => msg.phoneNumber === selectedConversation);
  const currentContact = conversationList.find(c => c.phoneNumber === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setSending(true);
    
    // Simulate sending delay
    setTimeout(() => {
      const newSMS: SMSMessage = {
        id: messages.length + 1,
        type: 'sent',
        phoneNumber: selectedConversation,
        contactName: currentContact?.contactName,
        message: newMessage,
        timestamp: 'Just now',
        status: 'pending'
      };

      setMessages(prev => [...prev, newSMS]);
      setNewMessage('');
      setSending(false);

      // Simulate delivery
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newSMS.id 
              ? { ...msg, status: 'delivered' as const, timestamp: 'Just now ✓' }
              : msg
          )
        );
      }, 1000);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Conversations */}
        <div className="w-1/3 border-r border-white/10 bg-gray-900/30 overflow-y-auto">
          <div className="p-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="space-y-1 p-2">
            {conversationList.map((convo: any) => (
              <button
                key={convo.phoneNumber}
                onClick={() => setSelectedConversation(convo.phoneNumber)}
                className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
                  selectedConversation === convo.phoneNumber
                    ? 'bg-blue-900/30 border border-blue-700/50'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        {convo.contactName?.[0] || '#'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {convo.contactName || convo.phoneNumber}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {convo.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{convo.lastTime}</p>
                    {convo.unread && (
                      <span className="inline-block mt-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Messages */}
        <div className="flex-1 flex flex-col bg-gray-900/20">
          {/* Conversation header */}
          <div className="p-4 border-b border-white/10 bg-gray-900/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg">
                  {currentContact?.contactName?.[0] || '#'}
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {currentContact?.contactName || selectedConversation}
                  </h4>
                  <p className="text-sm text-gray-400">{selectedConversation}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                  Call
                </button>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                  Add to Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.type === 'sent'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-800 text-white rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {msg.timestamp}
                    </span>
                    {msg.type === 'sent' && (
                      <span className={`text-xs ml-2 ${
                        msg.status === 'delivered' ? 'text-green-400' :
                        msg.status === 'failed' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {msg.status === 'delivered' ? '✓✓' :
                         msg.status === 'failed' ? '✗' :
                         '↻'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="p-4 border-t border-white/10 bg-gray-900/40">
            <div className="flex space-x-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="self-end px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <div>
                SMS cost: <span className="text-white">$0.0105</span>
              </div>
              <div>
                Characters: <span className="text-white">{newMessage.length}/160</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}