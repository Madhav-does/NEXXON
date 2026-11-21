import { NextResponse } from 'next/server';

export async function GET() {
  const defaultAppKey = 'tdrvipkstz555';
  const defaultAppSecret = 'AjbT4g9GVo45';
  const appKey = process.env.NEXT_PUBLIC_NEXCONN_APP_KEY || process.env.NEXCONN_APP_KEY || defaultAppKey;
  const appSecret = process.env.NEXCONN_APP_SECRET || defaultAppSecret;

  const hasAppKey = Boolean(appKey && appKey !== 'YOUR_APP_KEY');
  const hasAppSecret = Boolean(appSecret && appSecret !== 'YOUR_APP_SECRET');
  const isConfigured = hasAppKey && hasAppSecret;

  // STRICT SECURITY: Never return NEXCONN_APP_SECRET!
  // App-Key is public and safe to return
  return NextResponse.json({
    isConfigured,
    hasAppKey,
    hasAppSecret,
    appKey: hasAppKey ? appKey : null,
    appKeyPrefix: hasAppKey && appKey ? `${appKey.slice(0, 4)}...` : null,
    baseUrl: process.env.NEXCONN_API_BASE_URL || 'api.sg-light-api.com',
  });
}
