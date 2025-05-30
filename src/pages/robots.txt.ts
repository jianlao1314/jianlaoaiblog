import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Disallow: /MineWeb/
Disallow: /assets/
Disallow: /*?*
Disallow: /api/
Disallow: /admin/

# 控制爬虫访问频率
Crawl-delay: 10

# 允许搜索引擎访问
User-agent: Baiduspider
Allow: /
Crawl-delay: 5

User-agent: Googlebot
Allow: /
Crawl-delay: 5

User-agent: Bingbot
Allow: /
Crawl-delay: 5

Sitemap: ${sitemapURL.href}`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};