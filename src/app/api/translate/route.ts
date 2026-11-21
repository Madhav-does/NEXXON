import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { translateText } from '@/utils/translator';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, sourceLang = 'auto' } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields: text and targetLang' },
        { status: 400 }
      );
    }

    // Hash source for caching
    const hash = crypto
      .createHash('sha256')
      .update(`${sourceLang}:${targetLang}:${text.trim().toLowerCase()}`)
      .digest('hex');

    // Check database cache if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      try {
        const cached = await prisma.cachedTranslation.findUnique({
          where: { sourceHash: hash },
        });

        if (cached) {
          return NextResponse.json({
            translated: cached.translated,
            sourceLang: cached.sourceLang,
            targetLang: cached.targetLang,
            cached: true,
          });
        }
      } catch (dbErr) {
        // Fallback gracefully if database is not reachable yet
        console.warn('[Translate Cache Read Failed, falling back]', dbErr);
      }
    }

    // Translate using translation engine
    const translated = translateText(text, targetLang);

    // Save to cache asynchronously if DB is configured
    if (process.env.DATABASE_URL) {
      prisma.cachedTranslation
        .create({
          data: {
            sourceHash: hash,
            sourceLang,
            targetLang,
            sourceText: text,
            translated,
          },
        })
        .catch((e: any) => console.warn('[Translate Cache Write Error]', e));
    }

    return NextResponse.json({
      translated,
      sourceLang,
      targetLang,
      cached: false,
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
