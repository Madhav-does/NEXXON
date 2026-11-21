import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface TokenRequestBody {
  userId?: string;
  userName?: string;
  avatarUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TokenRequestBody;
    const { userId, userName, avatarUrl } = body;

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return NextResponse.json(
        { code: 400, message: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    const defaultAppKey = 'tdrvipkstz555';
    const defaultAppSecret = 'AjbT4g9GVo45';
    const appKey = process.env.NEXT_PUBLIC_NEXCONN_APP_KEY || process.env.NEXCONN_APP_KEY || defaultAppKey;
    const appSecret = process.env.NEXCONN_APP_SECRET || defaultAppSecret;
    const apiBaseUrl = process.env.NEXCONN_API_BASE_URL || 'api.sg-light-api.com';

    // Verify if environment variables or defaults are configured
    const isConfigured =
      !!appKey &&
      !!appSecret &&
      appKey !== 'YOUR_APP_KEY' &&
      appSecret !== 'YOUR_APP_SECRET';

    if (!isConfigured) {
      return NextResponse.json(
        {
          code: 4001,
          isConfigured: false,
          message:
            'Nexconn credentials are not configured. Please set NEXT_PUBLIC_NEXCONN_APP_KEY and NEXCONN_APP_SECRET.',
          userId,
        },
        { status: 400 }
      );
    }

    // Generate request signature per Nexconn API specification:
    // Signature = SHA1(AppSecret + Nonce + Timestamp)
    const nonce = Math.floor(Math.random() * 100000000).toString();
    const timestamp = Date.now().toString();
    const signature = crypto
      .createHash('sha1')
      .update(appSecret + nonce + timestamp)
      .digest('hex');
    const requestId = crypto.randomUUID();

    const nexconnEndpoint = `https://${apiBaseUrl}/v4/auth/access-token/issue`;

    const payload = {
      userId: userId.trim(),
      name: (userName || userId).trim(),
      ...(avatarUrl ? { avatarUrl: avatarUrl.trim() } : {}),
    };

    const response = await fetch(nexconnEndpoint, {
      method: 'POST',
      headers: {
        'App-Key': appKey,
        'Nonce': nonce,
        'Timestamp': timestamp,
        'Signature': signature,
        'X-Request-ID': requestId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || (result.code !== 0 && result.code !== 200)) {
      console.error('[Nexconn Token API Error]', {
        status: response.status,
        response: result,
      });
      return NextResponse.json(
        {
          code: result.code || response.status,
          message: result.msg || result.message || 'Failed to issue Nexconn token',
          error: result,
        },
        { status: response.status >= 400 ? response.status : 502 }
      );
    }

    const accessToken = result.result?.accessToken || result.accessToken || result.token;

    return NextResponse.json({
      code: 0,
      isConfigured: true,
      userId: result.result?.userId || userId,
      token: accessToken,
    });
  } catch (error: any) {
    console.error('[Nexconn Token API Exception]', error);
    return NextResponse.json(
      {
        code: 500,
        message: 'Internal server error while obtaining Nexconn token',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
