import { NextResponse } from 'next/server';

export async function GET() {
  const appKey = process.env.NEXT_PUBLIC_NEXCONN_APP_KEY || process.env.NEXCONN_APP_KEY;
  const appSecret = process.env.NEXCONN_APP_SECRET;

  const hasAppKey = Boolean(appKey && appKey !== 'YOUR_APP_KEY');
  const hasAppSecret = Boolean(appSecret && appSecret !== 'YOUR_APP_SECRET');
  const isConfigured = hasAppKey && hasAppSecret;

  // STRICT SECURITY: Never return NEXCONN_APP_SECRET!
  return NextResponse.json({
    isConfigured,
    hasAppKey,
    hasAppSecret,
    appKeyPrefix: hasAppKey && appKey ? `${appKey.slice(0, 4)}...` : null,
    baseUrl: process.env.NEXCONN_API_BASE_URL || 'api.sg-light-api.com',
  });
}
