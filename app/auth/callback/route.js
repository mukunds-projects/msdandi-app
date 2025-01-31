import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      
      // Exchange the code for a session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) throw sessionError;

      // Check if user exists in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw profileError;
      }

      // If profile doesn't exist, create one
      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_sign_in: new Date().toISOString()
          });

        if (insertError) throw insertError;
      } else {
        // Update last sign in time for existing users
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            last_sign_in: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);

        if (updateError) throw updateError;
      }
    }

    return NextResponse.redirect(new URL('/dashboards', request.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/?error=callback_error', request.url));
  }
} 