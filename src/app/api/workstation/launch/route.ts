import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { osType } = await req.json();
    
    // Mock response for testing
    return NextResponse.json({
      instanceId: 'i-1234567890abcdef0',
      osType: osType,
      region: 'us-east-1',
      status: 'running',
      connectionUrl: 'https://workstation.example.com'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to launch workstation' },
      { status: 500 }
    );
  }
}