
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (typeof window !== 'undefined') {
    if (!supabaseUrl) console.error('NEXT_PUBLIC_SUPABASE_URL is missing');
    if (!supabaseKey) console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');

    // Debug logging
    console.log('Supabase Config:', {
        url: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'MISSING',
        keyLength: supabaseKey ? supabaseKey.length : 0
    });
}

// Fallback is only for build time or severe misconfiguration to prevent crash
const urlToUse = supabaseUrl && supabaseUrl.startsWith('http')
    ? supabaseUrl
    : 'https://placeholder.supabase.co';

export const supabase = createClient(
    urlToUse,
    supabaseKey || 'placeholder-key'
);
