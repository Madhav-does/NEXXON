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

    const baseUrl = apiBaseUrl || 'api.sg-light-api.com';

    // Update in-memory environment variables immediately
    process.env.NEXT_PUBLIC_NEXCONN_APP_KEY = appKey.trim();
    process.env.NEXCONN_APP_KEY = appKey.trim();
    process.env.NEXCONN_APP_SECRET = appSecret.trim();
    process.env.NEXCONN_API_BASE_URL = baseUrl.trim();

    // In local development, write to .env.local if the file system is writable
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
      try {
        const envPath = path.join(process.cwd(), '.env.local');
        const envContent = `# Nexconn Chat Application Credentials
# Updated via Nexconn Setup Assistant
NEXT_PUBLIC_NEXCONN_APP_KEY=${appKey.trim()}
NEXCONN_APP_SECRET=${appSecret.trim()}
NEXCONN_API_BASE_URL=${baseUrl.trim()}
NEXT_PUBLIC_NEXCONN_DATA_CENTER=SG
`;
        fs.writeFileSync(envPath, envContent, 'utf8');
      } catch (fsErr) {
        console.warn('[Credentials Write Skipped - Read Only Environment]', fsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Credentials updated successfully for current runtime.',
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
