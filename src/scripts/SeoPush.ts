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
  },
  {
    name: '神马',
    api: 'https://zhanzhang.sm.cn/sm/submit',
    paramName: 'url',
    method: 'POST'
  },
  {
    name: '头条搜索',
    api: 'https://zhanzhang.toutiao.com/api/push',
    paramName: 'url',
    method: 'POST'
  }
];

// 推送URL到搜索引擎
const pushToSearchEngine = async (engine: SearchEngine, url: string) => {
  try {
    // 如果搜索引擎配置了URL转换函数，先转换URL
    const finalUrl = engine.transformUrl ? engine.transformUrl(url) : url;
    
    const params = { [engine.paramName]: finalUrl };
    const method = engine.method || 'POST';
    
    // 使用 Cloudflare Workers 环境变量中的 token
    const engineConfig = SITE_INFO.SeoPush.engines[engine.name.toLowerCase() as keyof typeof SITE_INFO.SeoPush.engines];
    const token = 'token' in engineConfig ? engineConfig.token : undefined;
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; JianlaoAIBlog/1.0; +https://ai.5334427.xyz)',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...engine.headers
    };

    // 在 Workers 环境中发送请求
    const response = await fetch(engine.api, {
      method,
      headers,
      body: method === 'GET' ? undefined : JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.text();
    console.log(`Successfully pushed to ${engine.name}:`, result);
  } catch (error) {
    console.error(`Failed to push to ${engine.name}:`, error);
  }
};

// 检查URL是否已经推送过
const checkUrlPushed = async (url: string): Promise<boolean> => {
  try {
    // 使用 Cloudflare KV 存储检查
    const pushedUrls = await window.PUSHED_URLS.get('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];
    return urls.includes(url);
  } catch (error) {
    console.error('Failed to check URL status:', error);
    return false;
  }
};

// 标记URL为已推送
const markUrlAsPushed = async (url: string) => {
  try {
    // 使用 Cloudflare KV 存储记录
    const pushedUrls = await window.PUSHED_URLS.get('pushed_urls');
    const urls = pushedUrls ? JSON.parse(pushedUrls) : [];
    
    if (!urls.includes(url)) {
      urls.push(url);
      await window.PUSHED_URLS.put('pushed_urls', JSON.stringify(urls));
    }
  } catch (error) {
    console.error('Failed to mark URL as pushed:', error);
  }
};

export default async () => {
  if (!SITE_INFO.SeoPush.enable) return;
  
  const currentUrl = window.location.href.replace(/\/$/, '');
  
  // 检查URL是否已经推送过
  const isPushed = await checkUrlPushed(currentUrl);
  if (isPushed) {
    console.log('URL already pushed, skipping...');
    return;
  }
  
  // 并行推送到所有启用的搜索引擎
  const pushPromises = searchEngines
    .filter(engine => {
      const engineConfig = SITE_INFO.SeoPush.engines[engine.name.toLowerCase() as keyof typeof SITE_INFO.SeoPush.engines];
      return engineConfig?.enable;
    })
    .map(engine => pushToSearchEngine(engine, currentUrl));
  
  await Promise.all(pushPromises);
  
  // 标记URL为已推送
  await markUrlAsPushed(currentUrl);
}