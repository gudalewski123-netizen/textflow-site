import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('DEBUG: Received request body:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Debug endpoint working',
      data: {
        receivedBody: body,
        userId: body.userId,
        clientId: body.clientId,
        areaCode: body.areaCode,
        targetUserId: body.userId || body.clientId,
        validation: {
          hasTargetUserId: !!body.userId || !!body.clientId,
          hasAreaCode: !!body.areaCode,
          isValid: (!!body.userId || !!body.clientId) && !!body.areaCode
        }
      }
    });
  } catch (error: any) {
    console.error('DEBUG Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}