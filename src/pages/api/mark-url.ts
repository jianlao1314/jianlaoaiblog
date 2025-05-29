import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // 从 KV 存储中获取已推送的 URL 列表
    const pushedUrls = await PUSHED_URLS.get('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];
    
    // 如果 URL 不在列表中，添加它
    if (!urls.includes(url)) {
      urls.push(url);
      // 将更新后的列表保存回 KV 存储
      await PUSHED_URLS.put('pushed_urls', JSON.stringify(urls));
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error marking URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 