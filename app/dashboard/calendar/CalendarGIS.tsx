"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function CalendarGIS() {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  
  // Load Google Identity Services
  useEffect(() => {
    const loadGIS = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initializeGIS;
      document.head.appendChild(script);
    };
    
    const initializeGIS = () => {
      console.log('Google Identity Services loaded');
    };
    
    if (typeof window !== 'undefined') {
      loadGIS();
    }
  }, []);
  
  const handleConnect = () => {
    if (!window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }
    
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (response: any) => {
        if (response.access_token) {
          console.log('Token received:', response.access_token.substring(0, 20) + '...');
          setToken(response.access_token);
          setIsConnected(true);
          fetchEvents(response.access_token);
        } else {
          console.error('Token error:', response);
        }
      },
    });
    
    client.requestAccessToken();
  };
  
  const fetchEvents = async (accessToken: string) => {
    try {
      const params = new URLSearchParams({
        timeMin: new Date().toISOString(),
        maxResults: '10',
        singleEvents: 'true',
        orderBy: 'startTime'
      });
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }
      
      const data = await response.json();
      setEvents(data.items || []);
      console.log('Events fetched:', data.items?.length || 0);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  
  const refreshEvents = () => {
    if (token) {
      fetchEvents(token);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-gray-400 mt-2">Your schedule at a glance</p>
      </div>
      
      {!isConnected ? (
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-gray-700 max-w-md">
            <p className="text-lg mb-4">Connect your Google Calendar to see your schedule</p>
            <button
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Connect Google Calendar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={refreshEvents}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh Events</span>
            </button>
            <button
              onClick={() => {
                setToken(null);
                setIsConnected(false);
                setEvents([]);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2"
            >
              <span>🔓</span>
              <span>Disconnect</span>
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Your Events</h2>
            <p className="text-gray-400 mt-2">Upcoming schedule</p>
          </div>
          
          {events.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-8 text-center border border-gray-700/50">
              <p className="text-gray-400">No upcoming events found</p>
              <button
                onClick={refreshEvents}
                className="mt-4 text-blue-400 hover:text-blue-300 underline"
              >
                Click to refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {events.map((event, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-5 border border-gray-700/50 shadow-lg hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold">
                        {event.start?.dateTime ? new Date(event.start.dateTime).getDate() : '📅'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{event.summary || 'No Title'}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        📅 {event.start?.dateTime ? (
                          new Date(event.start.dateTime).toLocaleString([], {
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        ) : (
                          event.start?.date || 'No date'
                        )}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}