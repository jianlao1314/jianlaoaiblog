import SITE_INFO from '@/config'
import { $POST } from '@/utils/index'

// 定义搜索引擎接口类型
interface SearchEngine {
  name: string;
  api: string;
  paramName: string;
  headers?: Record<string, string>;
  method?: 'GET' | 'POST';
  transformUrl?: (url: string) => string;
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
    name: 'Google',
    api: 'https://www.google.com/ping',
    paramName: 'sitemap'
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
  },
  {
    name: '必应中国',
    api: 'https://cn.bing.com/ping',
    paramName: 'sitemap'
  },
  {
    name: 'Yandex',
    api: 'https://blogs.yandex.com/pings/',
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
    
    if (method === 'POST') {
      await $POST(engine.api, params, engine.headers);
    } else {
      // 对于GET请求，将参数拼接到URL中
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${engine.api}?${queryString}`;
      await fetch(fullUrl, { method: 'GET' });
    }
    
    console.log(`Successfully pushed to ${engine.name}`);
  } catch (error) {
    console.error(`Failed to push to ${engine.name}:`, error);
  }
};

// 检查URL是否已经推送过
const checkUrlPushed = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/check-url?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.pushed;
  } catch (error) {
    console.error('Failed to check URL status:', error);
    return false;
  }
};

// 标记URL为已推送
const markUrlAsPushed = async (url: string) => {
  try {
    await fetch('/api/mark-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
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
  const pushPromises = searchEngines.map(engine => 
    pushToSearchEngine(engine, currentUrl)
  );
  
  await Promise.all(pushPromises);
  
  // 标记URL为已推送
  await markUrlAsPushed(currentUrl);
}