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
    name: '百度',
    api: 'https://data.zz.baidu.com/urls',
    paramName: 'url',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  },
  {
    name: 'Bing',
    api: 'https://www.bing.com/ping',
    paramName: 'sitemap'
  },
  {
    name: '360搜索',
    api: 'https://zhanzhang.so.com/sitetask/sitesubmit',
    paramName: 'url',
    method: 'POST'
  },
  {
    name: '搜狗',
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
      const response = await fetch(engine.api, {
        method: engine.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...engine.headers
        },
        body: JSON.stringify({ [engine.paramName]: url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Successfully pushed to ${engine.name}`);
      return;
    } catch (error) {
      retryCount++;
      if (retryCount === maxRetries) {
        console.error(`Failed to push to ${engine.name} after ${maxRetries} attempts:`, error);
        throw error;
      }
      // 指数退避重试
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    }
  }
}

// 主函数
export default async function SeoPush() {
  if (!SITE_INFO.SeoPush.enable) return;

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  
  // 只在文章页面且带有 push 参数时推送
  if (!url.pathname.startsWith('/posts/') || url.searchParams.get('push') !== 'true') {
    return;
  }

  try {
    // 获取启用的搜索引擎
    const enabledEngines = searchEngines.filter(engine => 
      SITE_INFO.SeoPush.engines[engine.name.toLowerCase()]?.enable
    );

    // 使用干净的 URL（不带参数）进行推送
    const cleanUrl = url.origin + url.pathname;

    // 并行推送
    const pushPromises = enabledEngines.map(engine => 
      pushToSearchEngine(cleanUrl, engine)
    );
    await Promise.all(pushPromises);
  } catch (error) {
    console.error('SEO push failed:', error);
  }
}