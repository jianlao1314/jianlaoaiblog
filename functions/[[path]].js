export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // 添加日志
  console.log('Request path:', path);
  console.log('Request URL:', url.toString());

  // 如果请求的是 .html 文件，直接返回
  if (path.endsWith('.html')) {
    console.log('Handling .html request directly');
    return context.env.ASSETS.fetch(context.request);
  }

  // 如果请求的是目录或没有后缀的文件，尝试添加 .html 后缀
  if (!path.includes('.')) {
    const htmlPath = path + '.html';
    console.log('Trying with .html suffix:', htmlPath);
    const htmlRequest = new Request(new URL(htmlPath, url.origin).toString(), context.request);
    const response = await context.env.ASSETS.fetch(htmlRequest);
    
    // 如果找到了对应的 .html 文件，返回它
    if (response.status === 200) {
      console.log('Found .html file, returning it');
      return response;
    }
  }

  // 其他请求直接返回
  console.log('Handling other request');
  return context.env.ASSETS.fetch(context.request);
} 