import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fetch from 'node-fetch';


export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key');

    // Query Supabase to check if the API key exists and is valid
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error || !data) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid API key' 
      }, { status: 400 });
    }

    // Check if the key has a monthly limit and if it's exceeded
    if (data.monthly_limit && data.usage >= data.monthly_limit) {
      return NextResponse.json({ 
        valid: false, 
        message: 'API key has exceeded its monthly limit' 
      }, { status: 400 });
    }

    // Update the usage count and last_used_at timestamp
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ 
        usage: (data.usage || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating usage:', updateError);
    }

    
   
    return NextResponse.json({ 
      valid: true,
      message: 'Valid API key',
      keyData: {
        name: data.name,
        usage: data.usage,
        monthly_limit: data.monthly_limit
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ 
      valid: false, 
      message: 'Error validating API key' 
    }, { status: 500 });
  }
} 