import SITE_INFO from '@/config'

// 定义搜索引擎接口类型
interface SearchEngine {
  name: string;
  api: string;
  paramName: string;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST';
  transformUrl?: (url: string) => string;
}

interface EngineConfig {
  enable: boolean;
  token?: string;
}

interface SeoPushConfig {
  enable: boolean;
  engines: {
    [key: string]: EngineConfig;
  };
}

// 定义 KV 存储接口
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

// 声明全局变量
declare global {
  interface Window {
    PUSHED_URLS: KVNamespace;
  }
}

// 支持的搜索引擎配置
const searchEngines: SearchEngine[] = [
  {
    name: 'baidu',
    api: 'https://seo.5334427.xyz',
    paramName: 'url',
    headers: {
      'Content-Type': 'text/plain'
    },
    transformUrl: (url: string) => url // Workers 代理需要直接传递 URL
  },
  {
    name: 'bing',
    api: 'https://www.bing.com/ping',
    paramName: 'sitemap'
  },
  {
    name: 'so360',
    api: 'https://zhanzhang.so.com/sitetask/sitesubmit',
    paramName: 'url',
    method: 'POST'
  },
  {
    name: 'sogou',
    api: 'https://zhanzhang.sogou.com/index.php/ziyuan/ajax/submit',
    paramName: 'url',
    method: 'POST'
  }
];

// 检查 URL 是否已经推送过
async function checkUrlPushed(url: string): Promise<boolean> {
  try {
    const pushedUrls = localStorage.getItem('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];
    return urls.includes(url);
  } catch (error) {
    console.error('Error checking URL:', error);
    return false;
  }
}

// 标记 URL 为已推送
async function markUrlAsPushed(url: string): Promise<void> {
  try {
    const pushedUrls = localStorage.getItem('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];
    
    if (!urls.includes(url)) {
      urls.push(url);
      localStorage.setItem('pushed_urls', JSON.stringify(urls));
    }
  } catch (error) {
    console.error('Error marking URL as pushed:', error);
  }
}

// 推送 URL 到搜索引擎
async function pushToSearchEngine(url: string, engine: SearchEngine): Promise<void> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log(`正在推送 ${url} 到 ${engine.name}...`);
      
      const response = await fetch(engine.api, {
        method: engine.method || 'POST',
        headers: engine.headers,
        body: engine.transformUrl ? engine.transformUrl(url) : JSON.stringify({ [engine.paramName]: url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log(`${engine.name} 推送成功:`, result);
      return;
    } catch (error) {
      retryCount++;
      console.error(`推送到 ${engine.name} 失败 (尝试 ${retryCount}/${maxRetries}):`, error);
      
      if (retryCount === maxRetries) {
        console.error(`推送到 ${engine.name} 最终失败`);
        throw error;
      }
      
      // 指数退避重试
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`等待 ${delay}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 主函数
export default async function SeoPush() {
  console.log('SeoPush 开始执行');
  
  if (!SITE_INFO.SeoPush.enable) {
    console.log('SeoPush 未启用');
    return;
  }

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  
  console.log('当前页面:', {
    pathname: url.pathname,
    hasPushParam: url.searchParams.get('push') === 'true'
  });
  
  // 只在文章页面且带有 push 参数时推送
  if (!url.pathname.startsWith('/article/') || url.searchParams.get('push') !== 'true') {
    console.log('不满足推送条件：不是文章页面或没有 push 参数');
    return;
  }

  try {
    // 获取启用的搜索引擎
    const enabledEngines = searchEngines.filter(engine => 
      SITE_INFO.SeoPush.engines[engine.name as keyof typeof SITE_INFO.SeoPush.engines]?.enable
    );
    
    console.log('启用的搜索引擎:', enabledEngines.map(e => e.name));
    console.log('当前配置:', SITE_INFO.SeoPush.engines);

    // 使用干净的 URL（不带参数）进行推送
    const cleanUrl = url.origin + url.pathname;
    console.log('准备推送的 URL:', cleanUrl);

    // 并行推送
    const pushPromises = enabledEngines.map(engine => 
      pushToSearchEngine(cleanUrl, engine)
    );
    await Promise.all(pushPromises);
    console.log('所有搜索引擎推送完成');
  } catch (error) {
    console.error('SEO push failed:', error);
  }
}