import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, request }) => {
  const searchParams = new URL(request.url).searchParams;
  const urlToCheck = searchParams.get('url');

  if (!urlToCheck) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // 从 KV 存储中获取已推送的 URL 列表
    const pushedUrls = await PUSHED_URLS.get('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];
    
    // 检查 URL 是否在列表中
    const isPushed = urls.includes(urlToCheck);

    return new Response(JSON.stringify({ pushed: isPushed }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error checking URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 