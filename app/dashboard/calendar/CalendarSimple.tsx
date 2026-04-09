"use client";

import { useState, useEffect } from "react";

// Type declarations for Google API
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: any) => Promise<any>;
        calendar?: {
          events: {
            list: (params: any) => Promise<any>;
          };
        };
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
          };
          signIn: () => Promise<any>;
        };
      };
    };
  }
}

export default function CalendarSimple() {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  
  // Load Google API
  useEffect(() => {
    console.log('Environment check:', {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? 'Present' : 'Missing',
      clientId: process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing'
    });
    
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = initGoogleAPI;
      document.body.appendChild(script);
    };
    
    const initGoogleAPI = () => {
      (window as any).gapi.load('client:auth2', () => {
        (window as any).gapi.client.init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          clientId: process.env.GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar.readonly',
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
        }).then(() => {
          console.log('Google API initialized successfully');
          console.log('API Key present:', !!process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
          console.log('Client ID present:', !!process.env.GOOGLE_CLIENT_ID);
          
          // Check if already signed in
          const authInstance = (window as any).gapi.auth2.getAuthInstance();
          setIsConnected(authInstance.isSignedIn.get());
        }).catch((error: any) => {
          console.error('Google API init error:', error);
        });
      });
    };
    
    if (typeof window !== 'undefined') {
      loadGoogleAPI();
    }
  }, []);
  
  const handleConnect = async () => {
    try {
      const authInstance = (window as any).gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      setIsConnected(true);
      fetchEvents();
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };
  
  const fetchEvents = async () => {
    try {
      const response = await (window as any).gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
      });
      
      setEvents(response.result.items || []);
    } catch (error) {
      console.error('Error fetching events:', error);
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
            <button
              onClick={fetchEvents}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Refresh Events
            </button>
          </div>
          
          {events.length === 0 ? (
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <p className="text-gray-400">No upcoming events found</p>
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}