export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // 如果请求的是 .html 文件，直接返回
  if (path.endsWith('.html')) {
    return context.next();
  }

  // 如果请求的是目录或没有后缀的文件，尝试添加 .html 后缀
  if (!path.includes('.')) {
    const htmlPath = path + '.html';
    const htmlRequest = new Request(new URL(htmlPath, url.origin).toString(), context.request);
    return context.next(htmlRequest);
  }

  return context.next();
} 