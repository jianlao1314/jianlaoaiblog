import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const env = locals?.runtime?.env;
  if (!env?.PUSHED_URLS) {
    return new Response(JSON.stringify({ error: 'KV not bound' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const searchParams = new URL(request.url).searchParams;
  const urlToCheck = searchParams.get('url');

  if (!urlToCheck) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const pushedUrls = await env.PUSHED_URLS.get('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];
    const isPushed = urls.includes(urlToCheck);

    return new Response(JSON.stringify({ pushed: isPushed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error checking URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 