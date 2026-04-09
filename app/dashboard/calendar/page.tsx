"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Helper function to format event time
const formatEventTime = (start: any, end: any) => {
  if (!start) return 'Time TBD';
  
  const startDate = start.dateTime ? new Date(start.dateTime) : new Date(start.date);
  const endDate = end?.dateTime ? new Date(end.dateTime) : end?.date ? new Date(end.date) : null;
  
  if (startDate.toDateString() === new Date().toDateString()) {
    return `Today, ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (startDate.toDateString() === new Date(Date.now() + 86400000).toDateString()) {
    return `Tomorrow, ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return `${startDate.toLocaleDateString()}, ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
};

// Helper function to determine event type
const getEventType = (title: string) => {
  if (title.toLowerCase().includes('sales')) return 'sales';
  if (title.toLowerCase().includes('follow')) return 'followup';
  if (title.toLowerCase().includes('onboard')) return 'onboarding';
  return 'internal';
};

export default function CalendarPage() {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const supabase = createClient();
  
  // Function to fetch Google Calendar events
  const fetchGoogleCalendarEvents = async (tokens: any) => {
    setIsLoadingEvents(true);
    try {
      console.log('Fetching calendar events with tokens:', tokens);
      const response = await fetch('/api/google-calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens })
      });
      
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const events = await response.json();
        console.log('Fetched events:', events);
        setCalendarEvents(events);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch calendar events:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };
  
  useEffect(() => {
    // Check if user has Google Calendar connected
    const checkConnection = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: connection } = await supabase
          .from('calendar_connection_status')
          .select('is_connected')
          .eq('user_id', data.user.id)
          .single();
        
        if (connection?.is_connected) {
          setIsGoogleConnected(true);
          // For now, use direct query - we'll fix RLS properly later
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('google_calendar_tokens')
            .eq('id', data.user.id)
            .single();
          if (profile?.google_calendar_tokens) {
            fetchGoogleCalendarEvents(profile.google_calendar_tokens);
          }
        }
      }
    };
    
    checkConnection();
    
    // Check for success/error from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'connected') {
      setIsGoogleConnected(true);
      setConnectionSuccess(true);
      setTimeout(() => setConnectionSuccess(false), 5000);
    }
    if (urlParams.get('error')) {
      setConnectionError('Failed to connect Google Calendar');
      setTimeout(() => setConnectionError(null), 5000);
    }
  }, []);
  
  const handleGoogleConnect = () => {
    setIsConnecting(true);
    window.location.href = '/api/google-calendar/auth';
  };
  
  const handleAddMeeting = () => {
    // TODO: Implement meeting modal
    alert('Add meeting functionality coming soon!');
  };
  
  const appointments = calendarEvents.length > 0 ? calendarEvents.map((event, index) => ({
    id: index + 1,
    title: event.summary || 'Untitled Event',
    time: formatEventTime(event.start, event.end),
    type: getEventType(event.summary || '')
  })) : [
    { id: 1, title: 'Sales Call - John Smith', time: 'Today, 3:00 PM', type: 'sales' },
    { id: 2, title: 'Follow-up - Sarah Johnson', time: 'Tomorrow, 11:00 AM', type: 'followup' },
    { id: 3, title: 'New Client Onboarding', time: 'Apr 10, 2:30 PM', type: 'onboarding' },
    { id: 4, title: 'Q2 Strategy Meeting', time: 'Apr 15, 9:00 AM', type: 'internal' }
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-blue-100 mt-2">Manage appointments and schedule</p>
        </div>
        <button 
          onClick={handleAddMeeting}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-bold"
        >
          + Add Meeting
        </button>
      </div>

      {/* Alerts */}
      {connectionSuccess && (
        <div className="p-4 bg-green-500/20 border border-green-500 text-green-300 rounded-xl">
          ✅ Google Calendar connected successfully!
        </div>
      )}
      {connectionError && (
        <div className="p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl">
          ❌ {connectionError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Month View */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">{currentMonth}</h2>
          
          {/* Week days */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="h-16 border border-white/20 rounded-lg p-2 text-sm hover:bg-white/5 transition-colors">
                <div className="text-gray-300">{i + 1}</div>
                {i === 6 && <div className="text-xs text-cyan-400 mt-1">Sales Call</div>}
                {i === 17 && <div className="text-xs text-green-400 mt-1">Onboarding</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {appointments.map(appt => (
                <div key={appt.id} className="border border-white/20 rounded-lg p-3 hover:bg-white/5 transition-colors">
                  <div className="font-medium">{appt.title}</div>
                  <div className="text-gray-300 text-sm mt-1">{appt.time}</div>
                  <div className="text-xs text-cyan-400 mt-2">Added by AI assistant</div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Calendar Sync */}
          <div className="bg-gradient-to-br from-black/40 to-cyan-900/20 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Google Calendar</h2>
            <p className="text-gray-300 text-sm mb-4">
              {isGoogleConnected 
                ? "Your Google Calendar is connected and syncing automatically" 
                : "Connect your Google Calendar to sync appointments automatically"}
            </p>
            
            {isGoogleConnected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-400 font-bold">Connected</span>
                  </div>
                  <div className="text-sm text-gray-400">Syncing events</div>
                </div>
                <button 
                  className="w-full bg-black/40 border border-white/20 text-white py-3 rounded-lg hover:bg-black/60 transition-colors"
                >
                  View Calendar
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGoogleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-bold"
              >
                {isConnecting ? "Connecting..." : "Connect Google Calendar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}