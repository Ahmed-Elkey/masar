import {NextResponse} from 'next/server';
import {inboxConfigured} from '@/lib/backend/messaging';
import {authConfigured} from '@/lib/backend/config';
export function GET(){return NextResponse.json({accounts:authConfigured(),messages:inboxConfigured(),challengeSiteKey:process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY??null},{headers:{'Cache-Control':'no-store'}});}
