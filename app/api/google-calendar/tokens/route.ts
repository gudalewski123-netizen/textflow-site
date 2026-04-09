import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Simple fallback - returns mock data for now
  return NextResponse.json({ 
    tokens: {
      access_token: "mock-token",
      refresh_token: "mock-refresh",
      scope: "https://www.googleapis.com/auth/calendar.readonly"
    }
  });
}