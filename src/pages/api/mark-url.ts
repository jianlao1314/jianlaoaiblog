import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals?.runtime?.env;
  if (!env?.PUSHED_URLS) {
    return new Response(JSON.stringify({ error: 'KV not bound' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const pushedUrls = await env.PUSHED_URLS.get('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];

    if (!urls.includes(url)) {
      urls.push(url);
      await env.PUSHED_URLS.put('pushed_urls', JSON.stringify(urls));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error marking URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 