import {NextResponse} from 'next/server';
import {liveCatalogue} from '@/lib/backend/catalogue';
export const dynamic='force-dynamic';
export async function GET(){const {records,connected}=await liveCatalogue();return NextResponse.json({records,connected},{headers:{'Cache-Control':'no-store'}});}
