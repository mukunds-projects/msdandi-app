import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { summarizeReadme } from './chain';

// Helper function to extract owner and repo from GitHub URL
function extractGitHubInfo(gitHubUrl) {
  try {
    const url = new URL(gitHubUrl);
    const [, owner, repo] = url.pathname.split('/');
    return { owner, repo };
  } catch (error) {
    throw new Error('Invalid GitHub URL format');
  }
}

// Function to fetch README content
async function getReadmeContent(owner, repo) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'MS-Dandi-App'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('README not found in repository');
      }
      throw new Error('Failed to fetch README');
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error('Error fetching README:', error);
    throw error;
  }
}

async function validateApiKey(apiKey) {
  try {
    // Query Supabase to check if the API key exists and is valid
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error || !data) {
      return { 
        valid: false, 
        message: 'Invalid API key',
        data: null
      };
    }

    // Check if the key has a monthly limit and if it's exceeded
    if (data.monthly_limit && data.usage >= data.monthly_limit) {
      return { 
        valid: false, 
        message: 'API key has exceeded its monthly limit',
        data: null
      };
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

    return {
      valid: true,
      message: 'Valid API key',
      data
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      valid: false,
      message: 'Error validating API key',
      data: null
    };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key is required' 
      }, { status: 401 });
    }

    // Validate the API key
    const validation = await validateApiKey(apiKey);
    
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.message 
      }, { status: 401 });
    }

    const { gitHubUrl } = body;

    if (!gitHubUrl) {
      return NextResponse.json({ 
        error: 'GitHub URL is required' 
      }, { status: 400 });
    }

    // Extract owner and repo from GitHub URL
    const { owner, repo } = extractGitHubInfo(gitHubUrl);

    // Fetch README content
    const readmeContent = await getReadmeContent(owner, repo);

    // Generate summary using the chain
    const aiSummary = await summarizeReadme(readmeContent);

    console.log(aiSummary);
    
    // Prepare the response
    const summary = {
      repository: gitHubUrl,
      ...aiSummary,
      fullReadme: readmeContent
    };

    return NextResponse.json({
      success: true,
      data: summary
    }, { status: 200 });

  } catch (error) {
    console.error('GitHub Summarizer error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 


