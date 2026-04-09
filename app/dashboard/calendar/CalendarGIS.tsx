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
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: new URLSearchParams({
            timeMin: new Date().toISOString(),
            maxResults: '10',
            singleEvents: 'true',
            orderBy: 'startTime'
          })
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      
      {!isConnected ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-gray-700">
          <p className="text-lg mb-4">Connect your Google Calendar to see your schedule</p>
          <button
            onClick={handleConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Connect Google Calendar
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Events</h2>
            <div className="space-x-3">
              <button
                onClick={refreshEvents}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Refresh Events
              </button>
              <button
                onClick={() => {
                  setToken(null);
                  setIsConnected(false);
                  setEvents([]);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Disconnect
              </button>
            </div>
          </div>
          
          {events.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <p className="text-gray-400">No upcoming events found</p>
              <button
                onClick={refreshEvents}
                className="mt-4 text-blue-400 hover:text-blue-300 underline"
              >
                Click to refresh
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-medium">{event.summary || 'No Title'}</h3>
                  <p className="text-sm text-gray-400">
                    {event.start?.dateTime ? (
                      new Date(event.start.dateTime).toLocaleString()
                    ) : (
                      event.start?.date || 'No date'
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.description?.substring(0, 100) || ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}