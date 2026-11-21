import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { appKey, appSecret, apiBaseUrl } = await req.json();

    if (!appKey || !appSecret) {
      return NextResponse.json(
        { error: 'Both appKey and appSecret are required.' },
        { status: 400 }
      );
    }

    const envPath = path.join(process.cwd(), '.env.local');
    const baseUrl = apiBaseUrl || 'api.sg-light-api.com';

    const envContent = `# Nexconn Chat Application Credentials
# Updated via Nexconn Setup Assistant
NEXT_PUBLIC_NEXCONN_APP_KEY=${appKey.trim()}
NEXCONN_APP_SECRET=${appSecret.trim()}
NEXCONN_API_BASE_URL=${baseUrl.trim()}
NEXT_PUBLIC_NEXCONN_DATA_CENTER=SG
`;

    fs.writeFileSync(envPath, envContent, 'utf8');

    // Update current process env for immediate runtime access
    process.env.NEXT_PUBLIC_NEXCONN_APP_KEY = appKey.trim();
    process.env.NEXCONN_APP_KEY = appKey.trim();
    process.env.NEXCONN_APP_SECRET = appSecret.trim();
    process.env.NEXCONN_API_BASE_URL = baseUrl.trim();

    return NextResponse.json({
      success: true,
      message: 'Credentials saved successfully to .env.local',
      appKeyPrefix: `${appKey.slice(0, 4)}...`,
    });
  } catch (error: any) {
    console.error('Error saving credentials:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save credentials' },
      { status: 500 }
    );
  }
}
