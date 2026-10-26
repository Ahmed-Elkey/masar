"use client";
import {createBrowserClient} from '@supabase/ssr';
import {authConfigured} from './config';
let client:ReturnType<typeof createBrowserClient>|undefined;
export function browserBackend(){if(!authConfigured())return null;return client??=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);}
